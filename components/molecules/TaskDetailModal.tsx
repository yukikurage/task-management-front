"use client";

import { useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { components } from "@/lib/api-schema";
import { apiClient } from "@/lib/api-client";
import { AssignUserModal } from "./AssignUserModal";
import { TaskEditModal } from "./TaskEditModal";

type Task = components["schemas"]["Task"];

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate?: () => void;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onTaskUpdate,
}: TaskDetailModalProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);

  if (!isOpen || !task) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleUnassignUser = async (userId: number) => {
    if (!task?.id) return;

    setIsUnassigning(true);
    try {
      const { error } = await apiClient.POST("/api/tasks/{id}/unassign", {
        params: {
          path: {
            id: task.id,
          },
        },
        body: {
          user_ids: [userId],
        },
      });

      if (error) {
        console.error("Failed to unassign user:", error);
        return;
      }

      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (err) {
      console.error("Error unassigning user:", err);
    } finally {
      setIsUnassigning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-2xl min-h-[548px] p-8 flex flex-col gap-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Organization and Title */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-normal text-text-secondary">
              {task.organization?.name || "組織なし"} /
            </p>
            <h2 className="text-2xl font-normal text-text-primary">
              {task.title}
            </h2>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-sm font-normal text-primary hover:text-primary-hover transition-colors"
          >
            Edit
          </button>
        </div>

        {/* Due Date */}
        {task.due_date && (
          <div className="flex gap-1 items-center">
            <ClockIcon className="w-3 h-3 text-text-tertiary" />
            <p className="text-sm font-normal text-text-tertiary">
              {formatDate(task.due_date)}
            </p>
          </div>
        )}

        {/* Assigned Users */}
        <div className="flex flex-col gap-1.5">
          {task.assignments && task.assignments.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {task.assignments.map((assignment) => (
                <div
                  key={assignment.user_id}
                  className="px-3 py-1.5 bg-white border border-border rounded-full flex items-center gap-1"
                >
                  <p className="text-xs font-medium">
                    <span className="text-text-tertiary">@</span>
                    <span className="text-text-secondary">
                      {assignment.user?.username}
                    </span>
                  </p>
                  <button
                    onClick={() => handleUnassignUser(assignment.user_id)}
                    disabled={isUnassigning}
                    className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Assign Button */}
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-1 py-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Assign
          </button>
        </div>

        {/* Description */}
        <div className="flex-1 py-2 overflow-y-auto">
          <p className="text-base font-normal text-text-secondary whitespace-pre-wrap">
            {task.description}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute bottom-8 left-8 px-0 py-1.5 text-xs font-bold text-text-tertiary hover:text-text-secondary transition-colors"
        >
          ← back
        </button>
      </div>

      {/* Assign User Modal */}
      {task.organization_id && (
        <AssignUserModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          taskId={task.id}
          organizationId={task.organization_id}
          currentAssignments={
            task.assignments?.map((a) => a.user_id) || []
          }
          onSuccess={() => {
            if (onTaskUpdate) {
              onTaskUpdate();
            }
          }}
        />
      )}

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onSuccess={() => {
          if (onTaskUpdate) {
            onTaskUpdate();
          }
        }}
      />
    </div>
  );
}
