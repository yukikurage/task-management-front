"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";
import { Button } from "../atoms/Button";

type Task = components["schemas"]["Task"];

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

export function TaskEditModal({
  isOpen,
  onClose,
  onSuccess,
  task,
}: TaskEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-populate form when task changes
  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");

      // Format due_date for date input (YYYY-MM-DD)
      if (task.due_date) {
        const date = new Date(task.due_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate("");
      }
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!task?.id) {
      setError("タスクIDが見つかりません。");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: apiError } = await apiClient.PATCH(
        "/api/tasks/{id}",
        {
          params: {
            path: {
              id: task.id,
            },
          },
          body: {
            title,
            description,
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
          },
        }
      );

      if (apiError || !data) {
        setError("タスクの更新に失敗しました。");
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError("タスクの更新中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-2xl min-h-[548px] p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-normal text-text-primary">Edit Task</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Organization (Read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Organization
            </label>
            <div className="px-4 py-2.5 text-text-tertiary bg-gray-50 rounded-lg border border-border">
              {task.organization?.name || "組織なし"}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Title <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={setTitle}
              required
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Due Date
            </label>
            <Input type="date" value={dueDate} onChange={setDueDate} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium text-text-secondary">
              Description
            </label>
            <Textarea
              placeholder="Enter task description"
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button onClick={handleClose} variant="tertiary">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              variant="primary"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
