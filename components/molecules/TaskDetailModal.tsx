"use client";

import { useEffect, useState } from "react";
import { ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import { components } from "@/lib/api-schema";
import { apiClient } from "@/lib/api-client";
import { AssignUserModal } from "./AssignUserModal";
import { TaskEditModal } from "./TaskEditModal";

type Task = components["schemas"]["Task"];
type User = components["schemas"]["User"];

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
  const [taskDetail, setTaskDetail] = useState<Task | null>(task);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (task) {
      setTaskDetail(task);
    }
  }, [task]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const { data, error } = await apiClient.GET("/api/auth/me");
        if (!error && data && isMounted) {
          setCurrentUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const refreshTaskDetail = async () => {
    if (!taskDetail?.id) return;

    try {
      const { data, error } = await apiClient.GET("/api/tasks/{id}", {
        params: {
          path: {
            id: taskDetail.id,
          },
        },
      });

      if (error) {
        console.error("Failed to refresh task detail:", error);
        return;
      }

      if (data) {
        setTaskDetail(data);
      }
    } catch (err) {
      console.error("Error refreshing task detail:", err);
    }
  };

  const isCreator = currentUser?.id === taskDetail?.creator_id;

  if (!isOpen || !taskDetail) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleUnassignUser = async (userId: number) => {
    if (!taskDetail?.id) return;

    setIsUnassigning(true);
    try {
      const { error } = await apiClient.POST("/api/tasks/{id}/unassign", {
        params: {
          path: {
            id: taskDetail.id,
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

      await refreshTaskDetail();

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
              {taskDetail.organization?.name || "組織なし"} /
            </p>
            <h2 className="text-2xl font-normal text-text-primary">
              {taskDetail.title}
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
        {taskDetail.due_date && (
          <div className="flex gap-1 items-center">
            <ClockIcon className="w-3 h-3 text-text-tertiary" />
            <p className="text-sm font-normal text-text-tertiary">
              {formatDate(taskDetail.due_date)}
            </p>
          </div>
        )}

        {/* Creator */}
        <div className="text-sm text-text-tertiary">
          Created by{" "}
          <span className="text-text-secondary font-medium">
            {taskDetail.creator?.username
              ? `@${taskDetail.creator.username}`
              : `User #${taskDetail.creator_id}`}
          </span>
        </div>

        {/* Assigned Users */}
        <div className="flex flex-col gap-1.5">
          {taskDetail.assignments && taskDetail.assignments.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {taskDetail.assignments.map((assignment) => (
                <div
                  key={assignment.user.id}
                  className="px-3 py-1.5 bg-white border border-border rounded-full flex items-center gap-1"
                >
                  <p className="text-xs font-medium">
                    <span className="text-text-tertiary">@</span>
                    <span className="text-text-secondary">
                      {assignment.user.username}
                    </span>
                  </p>
                  {
                    <button
                      onClick={() => handleUnassignUser(assignment.user.id)}
                      disabled={isUnassigning}
                      className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✕
                    </button>
                  }
                </div>
              ))}
            </div>
          )}

          {/* Assign Button */}
          {
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-1 py-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <PlusIcon className="h-3 w-3" />
              Assign
            </button>
          }
        </div>

        {/* Description */}
        <div className="flex-1 py-2 overflow-y-auto">
          <p className="text-base font-normal text-text-secondary whitespace-pre-wrap">
            {taskDetail.description}
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
      {taskDetail.organization_id && (
        <AssignUserModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          taskId={taskDetail.id}
          organizationId={taskDetail.organization_id}
          currentAssignments={
            taskDetail.assignments?.map((a) => a.user.id) || []
          }
          onSuccess={() => {
            refreshTaskDetail();
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
        task={taskDetail}
        canDelete={isCreator}
        onDelete={() => {
          setIsEditModalOpen(false);
          setTaskDetail(null);
          onClose();
          if (onTaskUpdate) {
            onTaskUpdate();
          }
        }}
        onSuccess={() => {
          refreshTaskDetail();
          if (onTaskUpdate) {
            onTaskUpdate();
          }
        }}
      />
    </div>
  );
}
