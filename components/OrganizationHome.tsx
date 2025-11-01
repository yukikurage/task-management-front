"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { TaskCardList } from "@/components/organisms/TaskCardList";
import { TaskCardGrid } from "@/components/organisms/TaskCardGrid";
import { TaskDetailModal } from "@/components/molecules/TaskDetailModal";
import { OrganizationDetailModal } from "@/components/molecules/OrganizationDetailModal";
import { NewTaskButton } from "@/components/molecules/NewTaskButton";
import { ChatPanel } from "@/components/molecules/ChatPanel";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type Task = components["schemas"]["Task"];
type TaskSummary = components["schemas"]["TaskListItem"];
type Organization = components["schemas"]["Organization"];

interface OrganizationHomeProps {
  refreshKey?: number;
  organizationId: number;
  onTaskCreated?: () => void;
}

export function OrganizationHome({
  refreshKey,
  organizationId,
  onTaskCreated,
}: OrganizationHomeProps) {
  const [todayTasks, setTodayTasks] = useState<TaskSummary[]>([]);
  const [allTasks, setAllTasks] = useState<TaskSummary[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    setPortalTarget(document.getElementById("floating-space"));
  }, []);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data } = await apiClient.GET("/api/organizations/{id}", {
          params: {
            path: {
              id: organizationId,
            },
          },
        });
        if (data) {
          setCurrentOrganization(data);
        }
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch today's tasks (due today)
      const { data: todayData } = await apiClient.GET("/api/tasks", {
        params: {
          query: {
            due_today: true,
            organization_id: organizationId,
            ...(showOnlyAssigned && { assigned_to_me: true }),
          },
        },
      });
      setTodayTasks(todayData?.tasks || []);

      // Fetch all tasks (sorted by due date)
      const { data: allData } = await apiClient.GET("/api/tasks", {
        params: {
          query: {
            organization_id: organizationId,
            sort: "due_date",
            ...(showOnlyAssigned && { assigned_to_me: true }),
          },
        },
      });
      setAllTasks(allData?.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, showOnlyAssigned]);

  useEffect(() => {
    fetchTasks();
  }, [refreshKey, fetchTasks]);

  const handleTaskClick = async (task: TaskSummary) => {
    try {
      const { data, error } = await apiClient.GET("/api/tasks/{id}", {
        params: {
          path: {
            id: task.id,
          },
        },
      });

      if (error || !data) {
        console.error("Failed to fetch task details:", error);
        return;
      }

      setSelectedTask(data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <div className="flex flex-col gap-12 pt-24 pb-32 w-full">
      {/* Organization Header */}
      {currentOrganization && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="group inline-flex items-center gap-2 rounded-lg border border-transparent text-lg font-medium text-text-primary transition-all duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span>{currentOrganization.name}</span>
            <Cog6ToothIcon className="h-5 w-5 text-text-tertiary transition-colors duration-200 group-hover:text-primary" />
          </button>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAssigned}
              onChange={(e) => setShowOnlyAssigned(e.target.checked)}
              className="cursor-pointer"
            />
            自分にアサインされたタスクのみ表示
          </label>
        </div>
      )}

      {/* Today Section */}
      <div className="flex flex-col gap-6 w-full">
        <SectionTitle>Today</SectionTitle>
        <TaskCardList
          tasks={todayTasks}
          isLoading={isLoading}
          emptyMessage="今日のタスクはありません"
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* All Section */}
      <div className="flex flex-col gap-6 w-full">
        <SectionTitle>All</SectionTitle>
        <TaskCardGrid
          tasks={allTasks}
          isLoading={isLoading}
          emptyMessage="タスクはありません"
          onTaskClick={handleTaskClick}
        />
      </div>

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskUpdate={fetchTasks}
      />

      {currentOrganization && (
        <OrganizationDetailModal
          isOpen={isOrgModalOpen}
          onClose={() => setIsOrgModalOpen(false)}
          organizationId={currentOrganization.id}
        />
      )}

      {/* Floating elements via Portal */}
      {portalTarget &&
        createPortal(
          <>
            <div className="absolute bottom-[116px] right-0 pointer-events-none">
              <div className="pointer-events-auto">
                <NewTaskButton
                  onSuccess={handleTaskCreated}
                  defaultOrganizationId={organizationId}
                />
              </div>
            </div>

            <div className="absolute bottom-8 left-0 w-full pointer-events-none">
              <div className="pointer-events-auto">
                <ChatPanel
                  defaultOrganizationId={organizationId}
                  onSuccess={handleTaskCreated}
                />
              </div>
            </div>
          </>,
          portalTarget
        )}
    </div>
  );
}
