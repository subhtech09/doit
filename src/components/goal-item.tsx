import { cn } from "@/lib/utils";
import { formatDisplayDate, getDaysLeft, getDeadlineText } from "@/lib/goal-dates";
import type { Goal } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface GoalItemProps {
  goal: Goal;
  today: Date;
  isSelected: boolean;
  reorderEnabled?: boolean;
  onSelectedChange: (goalId: string, isSelected: boolean) => void;
  onDelete: (goalId: string) => void;
  onMoveToCompleted?: (goalId: string) => void;
}

export function GoalItem({
  goal,
  today,
  isSelected,
  reorderEnabled = false,
  onSelectedChange,
  onDelete,
  onMoveToCompleted,
}: GoalItemProps) {
  const daysLeft = getDaysLeft(goal.endDate, today);
  const deadlineText = getDeadlineText(goal.endDate, today);
  const isUrgent = goal.status === "current" && Number.isFinite(daysLeft) && daysLeft <= 3;
  const labelText = `Select goal ${goal.title}`;

  return (
    <li
      data-goal-id={goal.id}
      className={cn(
        "rounded-lg border bg-app-surface p-4 shadow-sm",
        reorderEnabled && "cursor-grab active:cursor-grabbing",
        reorderEnabled && "touch-none",
        goal.status === "completed" && "bg-app-completed/50",
        isUrgent && "border-app-urgent-border bg-app-urgent",
        reorderEnabled && "data-[dragging=true]:opacity-70",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="break-words font-medium">{goal.title}</p>
          <p className="text-sm text-app-text-muted">
            Due {formatDisplayDate(goal.endDate)} · {deadlineText}
          </p>
          {isUrgent ? <p className="text-sm font-semibold">Urgent goal</p> : null}
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`goal-select-${goal.id}`}
              checked={isSelected}
              onCheckedChange={(checked) => onSelectedChange(goal.id, checked === true)}
              aria-label={labelText}
              className="h-6 w-6"
            />
            <label htmlFor={`goal-select-${goal.id}`} className="text-sm text-app-text-muted">
              Select
            </label>
          </div>

          {isSelected ? (
            <div className="flex flex-wrap gap-2">
              {goal.status === "current" && onMoveToCompleted ? (
                <Button type="button" size="sm" onClick={() => onMoveToCompleted(goal.id)}>
                  Move to completed
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onDelete(goal.id)}
                aria-label={`Delete goal ${goal.title}`}
              >
                Delete {goal.title}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
