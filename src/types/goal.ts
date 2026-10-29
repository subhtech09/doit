export type GoalStatus = "current" | "completed";

export interface Goal {
  id: string;
  title: string;
  endDate: string;
  status: GoalStatus;
  orderIndex: number;
}
