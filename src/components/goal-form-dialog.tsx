"use client";

import { useState } from "react";

import { validateCreationEndDate } from "@/lib/goal-dates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalFormValues {
  title: string;
  endDate: string;
}

interface GoalFormDialogProps {
  onCreateGoal: (values: GoalFormValues) => { ok: true } | { ok: false; message: string };
}

interface FieldErrors {
  title?: string;
  endDate?: string;
}

export function GoalFormDialog({ onCreateGoal }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setEndDate("");
    setErrors({});
    setFormMessage(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      nextErrors.title = "Title is required.";
    }

    if (!endDate) {
      nextErrors.endDate = "End date is required.";
    } else {
      const dateError = validateCreationEndDate(endDate);
      if (dateError) {
        nextErrors.endDate = dateError;
      }
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setFormMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const createResult = onCreateGoal({
      title: title.trim(),
      endDate,
    });

    if (!createResult.ok) {
      setFormMessage(createResult.message);
      return;
    }

    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>Add goal</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add goal</DialogTitle>
          <DialogDescription>Create a goal with a title and end date.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "goal-title-error" : undefined}
              maxLength={200}
            />
            {errors.title ? (
              <p id="goal-title-error" className="text-sm text-destructive">
                {errors.title}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-end-date">End date</Label>
            <Input
              id="goal-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-invalid={Boolean(errors.endDate)}
              aria-describedby={errors.endDate ? "goal-end-date-error" : undefined}
            />
            {errors.endDate ? (
              <p id="goal-end-date-error" className="text-sm text-destructive">
                {errors.endDate}
              </p>
            ) : null}
          </div>
          {formMessage ? (
            <p role="status" aria-live="polite" className="text-sm text-destructive">
              {formMessage}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
