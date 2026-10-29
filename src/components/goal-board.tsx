"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sortable from "sortablejs";

import { GoalFormDialog } from "@/components/goal-form-dialog";
import { GoalItem } from "@/components/goal-item";
import { getTodayLocalDate } from "@/lib/goal-dates";
import {
  applyVisibleGoalReorder,
  createOrderVersionToken,
  moveGoalId,
  normalizeGoalOrder,
  sortCurrentGoalsByOrder,
} from "@/lib/goal-order";
import { loadGoals, saveGoals } from "@/lib/goal-storage";
import type { Goal } from "@/types/goal";

function msUntilNextLocalMidnight(now: Date): number {
  const nextMidnight = new Date(now);
  nextMidnight.setDate(now.getDate() + 1);
  nextMidnight.setHours(0, 0, 1, 0);
  return nextMidnight.getTime() - now.getTime();
}

export function GoalBoard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [today, setToday] = useState<Date | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const currentListRef = useRef<HTMLUListElement | null>(null);
  const dragStartVersionRef = useRef<string | null>(null);
  const goalsRef = useRef<Goal[]>([]);
  const currentGoalIdsRef = useRef<string[]>([]);
  const currentOrderVersionRef = useRef<string>("");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const loadResult = loadGoals();
      if (loadResult.ok) {
        setGoals(normalizeGoalOrder(loadResult.value));
        setStatusMessage("Saved goals loaded.");
      } else {
        setStatusMessage(loadResult.message);
      }
      setToday(getTodayLocalDate(new Date()));
      setIsLoading(false);
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    if (!today) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToday(getTodayLocalDate());
    }, msUntilNextLocalMidnight(new Date()));

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setToday(getTodayLocalDate());
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [today]);

  const currentGoals = useMemo(
    () => sortCurrentGoalsByOrder(goals.filter((goal) => goal.status === "current")),
    [goals],
  );
  const currentGoalIds = useMemo(() => currentGoals.map((goal) => goal.id), [currentGoals]);
  const currentOrderVersion = useMemo(() => createOrderVersionToken(currentGoalIds), [currentGoalIds]);

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "completed"),
    [goals],
  );

  useEffect(() => {
    goalsRef.current = goals;
    currentGoalIdsRef.current = currentGoalIds;
    currentOrderVersionRef.current = currentOrderVersion;
  }, [goals, currentGoalIds, currentOrderVersion]);

  const handleCreateGoal = (values: { title: string; endDate: string }) => {
    if (!window.crypto?.randomUUID) {
      return {
        ok: false as const,
        message: "Your browser does not support secure goal IDs.",
      };
    }

    const nextGoal: Goal = {
      id: window.crypto.randomUUID(),
      title: values.title,
      endDate: values.endDate,
      status: "current",
      orderIndex: currentGoals.length,
    };

    const nextGoals = normalizeGoalOrder([...goals, nextGoal]);
    const saveResult = saveGoals(nextGoals);
    if (!saveResult.ok) {
      return {
        ok: false as const,
        message: saveResult.message,
      };
    }

    setGoals(nextGoals);
    setStatusMessage(`Saved goal ${nextGoal.title}.`);
    return { ok: true as const };
  };

  const clearSelectionIfRemoved = (goalId: string) => {
    setSelectedGoalId((currentSelection) => (currentSelection === goalId ? null : currentSelection));
  };

  const handleMoveToCompleted = (goalId: string) => {
    const goal = goals.find((item) => item.id === goalId && item.status === "current");
    if (!goal) {
      return;
    }

    const remaining = goals.filter((item) => item.id !== goalId);
    const movedGoal: Goal = { ...goal, status: "completed" };
    const nextGoals = normalizeGoalOrder([...remaining, movedGoal]);
    const saveResult = saveGoals(nextGoals);
    if (!saveResult.ok) {
      setStatusMessage(saveResult.message);
      return;
    }

    setGoals(nextGoals);
    clearSelectionIfRemoved(goalId);
    setStatusMessage(`Moved ${goal.title} to completed.`);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) {
      return;
    }

    const nextGoals = normalizeGoalOrder(goals.filter((item) => item.id !== goalId));
    const saveResult = saveGoals(nextGoals);
    if (!saveResult.ok) {
      setStatusMessage(saveResult.message);
      return;
    }

    setGoals(nextGoals);
    clearSelectionIfRemoved(goalId);
    setStatusMessage(`Deleted ${goal.title}.`);
  };

  const handleDropReorder = useCallback(
    (fromIndex: number | undefined, toIndex: number | undefined) => {
      if (fromIndex === undefined || toIndex === undefined) {
        return;
      }

      if (fromIndex === toIndex) {
        setStatusMessage("Goal order unchanged.");
        return;
      }

      if (dragStartVersionRef.current !== null && dragStartVersionRef.current !== currentOrderVersionRef.current) {
        const refreshResult = loadGoals();
        if (refreshResult.ok) {
          setGoals(normalizeGoalOrder(refreshResult.value));
          setStatusMessage("Goal list changed while dragging. Latest saved order loaded. Please retry.");
        } else {
          setStatusMessage(refreshResult.message);
        }
        return;
      }

      const reorderedGoalIds = moveGoalId(currentGoalIdsRef.current, fromIndex, toIndex);
      if (!reorderedGoalIds || reorderedGoalIds === currentGoalIdsRef.current) {
        setStatusMessage("Goal order unchanged.");
        return;
      }

      const nextGoals = applyVisibleGoalReorder(goalsRef.current, reorderedGoalIds);
      const saveResult = saveGoals(nextGoals);
      if (!saveResult.ok) {
        const refreshResult = loadGoals();
        if (refreshResult.ok) {
          setGoals(normalizeGoalOrder(refreshResult.value));
        }
        setStatusMessage(saveResult.message);
        return;
      }

      setGoals(nextGoals);
      setStatusMessage("Goal order saved.");
    },
    [],
  );

  useEffect(() => {
    const listElement = currentListRef.current;
    if (!listElement || currentGoals.length < 2) {
      return;
    }

    const sortable = Sortable.create(listElement, {
      animation: 160,
      dataIdAttr: "data-goal-id",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      onStart: (event) => {
        dragStartVersionRef.current = currentOrderVersionRef.current;
        event.item.setAttribute("data-dragging", "true");
      },
      onEnd: (event) => {
        event.item.removeAttribute("data-dragging");
        handleDropReorder(event.oldIndex, event.newIndex);
        dragStartVersionRef.current = null;
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [currentGoals.length, handleDropReorder]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">doit</h1>
        <GoalFormDialog onCreateGoal={handleCreateGoal} />
      </div>

      <p role="status" aria-live="polite" className="min-h-6 text-sm text-app-text-muted">
        {statusMessage}
      </p>

      {isLoading || !today ? (
        <div className="rounded-lg border bg-app-surface-strong p-6 text-sm text-app-text-muted">
          Loading saved goals...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section aria-labelledby="current-goals-heading" className="rounded-xl border bg-card p-4">
            <h2 id="current-goals-heading" className="text-xl font-semibold">
              Current goals
            </h2>
            {currentGoals.length === 0 ? (
              <p className="mt-3 text-sm text-app-text-muted">No current goals yet. Add a goal to get started.</p>
            ) : (
              <ul ref={currentListRef} className="mt-3 space-y-3">
                {currentGoals.map((goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    today={today}
                    isSelected={selectedGoalId === goal.id}
                    reorderEnabled
                    onSelectedChange={(goalId, isSelected) => setSelectedGoalId(isSelected ? goalId : null)}
                    onMoveToCompleted={handleMoveToCompleted}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="completed-goals-heading" className="rounded-xl border bg-card p-4">
            <h2 id="completed-goals-heading" className="text-xl font-semibold">
              Completed goals
            </h2>
            {completedGoals.length === 0 ? (
              <p className="mt-3 text-sm text-app-text-muted">No completed goals yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {completedGoals.map((goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    today={today}
                    isSelected={selectedGoalId === goal.id}
                    onSelectedChange={(goalId, isSelected) => setSelectedGoalId(isSelected ? goalId : null)}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
