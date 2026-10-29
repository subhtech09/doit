import { isCanonicalDate } from "@/lib/goal-dates";
import type { Goal, GoalStatus } from "@/types/goal";

export const GOAL_STORAGE_KEY = "doit:goals:v1";

export type GoalStorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string; kind: "unavailable" | "malformed" | "unknown" };

function isGoalOrderIndex(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isGoalStatus(value: unknown): value is GoalStatus {
  return value === "current" || value === "completed";
}

function isGoalRecord(value: unknown): value is Goal {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    record.id.trim().length > 0 &&
    typeof record.title === "string" &&
    record.title.trim().length > 0 &&
    typeof record.endDate === "string" &&
    isCanonicalDate(record.endDate) &&
    isGoalStatus(record.status) &&
    (record.orderIndex === undefined || isGoalOrderIndex(record.orderIndex))
  );
}

export function loadGoals(): GoalStorageResult<Goal[]> {
  if (typeof window === "undefined") {
    return {
      ok: false,
      kind: "unavailable",
      message: "Goal data can only be loaded in a browser session.",
    };
  }

  try {
    const raw = window.localStorage.getItem(GOAL_STORAGE_KEY);
    if (!raw) {
      return { ok: true, value: [] };
    }

    const decoded = JSON.parse(raw);
    if (!Array.isArray(decoded)) {
      return {
        ok: false,
        kind: "malformed",
        message: "Saved goal data is malformed. Clear storage and try again.",
      };
    }

    const invalidRecord = decoded.find((item) => !isGoalRecord(item));
    if (invalidRecord) {
      return {
        ok: false,
        kind: "malformed",
        message: "Saved goal data is malformed. Clear storage and try again.",
      };
    }

    return {
      ok: true,
      value: decoded.map((goal, index) => ({
        id: goal.id,
        title: goal.title.trim(),
        endDate: goal.endDate,
        status: goal.status,
        orderIndex: isGoalOrderIndex(goal.orderIndex) ? goal.orderIndex : index,
      })),
    };
  } catch (error) {
    const isSecurityError =
      error instanceof DOMException && (error.name === "SecurityError" || error.name === "QuotaExceededError");

    return {
      ok: false,
      kind: isSecurityError ? "unavailable" : "unknown",
      message: isSecurityError
        ? "Browser storage is unavailable. Changes cannot be persisted in this browser."
        : "Goal data could not be loaded from browser storage.",
    };
  }
}

export function saveGoals(goals: Goal[]): GoalStorageResult<null> {
  if (typeof window === "undefined") {
    return {
      ok: false,
      kind: "unavailable",
      message: "Goal data can only be saved in a browser session.",
    };
  }

  try {
    window.localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goals));
    return { ok: true, value: null };
  } catch (error) {
    const isStorageError =
      error instanceof DOMException && (error.name === "SecurityError" || error.name === "QuotaExceededError");

    return {
      ok: false,
      kind: isStorageError ? "unavailable" : "unknown",
      message: isStorageError
        ? "Browser storage is unavailable. This change could not be saved."
        : "This change could not be saved to browser storage.",
    };
  }
}
