import type { Goal } from "@/types/goal";

function hasValidOrderIndex(goal: Goal): boolean {
  return Number.isInteger(goal.orderIndex) && goal.orderIndex >= 0;
}

export function sortCurrentGoalsByOrder(goals: Goal[]): Goal[] {
  return goals
    .map((goal, index) => ({ goal, index }))
    .sort((a, b) => {
      const aHasOrder = hasValidOrderIndex(a.goal);
      const bHasOrder = hasValidOrderIndex(b.goal);

      if (aHasOrder && bHasOrder) {
        if (a.goal.orderIndex !== b.goal.orderIndex) {
          return a.goal.orderIndex - b.goal.orderIndex;
        }
      } else if (aHasOrder) {
        return -1;
      } else if (bHasOrder) {
        return 1;
      }

      const dateCompare = a.goal.endDate.localeCompare(b.goal.endDate);
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return a.index - b.index;
    })
    .map((entry) => entry.goal);
}

export function normalizeGoalOrder(goals: Goal[]): Goal[] {
  const currentGoals = sortCurrentGoalsByOrder(goals.filter((goal) => goal.status === "current"))
    .map((goal, orderIndex) => ({ ...goal, orderIndex }));

  const completedGoals = goals.filter((goal) => goal.status === "completed");

  return [...currentGoals, ...completedGoals];
}

export function createOrderVersionToken(goalIds: string[]): string {
  return goalIds.join("|");
}

export function moveGoalId(goalIds: string[], fromIndex: number, toIndex: number): string[] | null {
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= goalIds.length || toIndex >= goalIds.length) {
    return null;
  }

  if (fromIndex === toIndex) {
    return goalIds;
  }

  const reordered = [...goalIds];
  const [movedId] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedId);
  return reordered;
}

export function applyVisibleGoalReorder(goals: Goal[], orderedVisibleGoalIds: string[]): Goal[] {
  const visibleIndexById = new Map(orderedVisibleGoalIds.map((id, index) => [id, index]));

  const nextGoals = goals.map((goal) => {
    const nextIndex = visibleIndexById.get(goal.id);
    if (nextIndex === undefined || goal.status !== "current") {
      return goal;
    }

    return { ...goal, orderIndex: nextIndex };
  });

  return normalizeGoalOrder(nextGoals);
}
