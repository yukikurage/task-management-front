"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { TaskCard } from "@/components/molecules/TaskCard";
import { TaskCardMini } from "@/components/molecules/TaskCardMini";
import { TaskDetailModal } from "@/components/molecules/TaskDetailModal";
import { OrganizationDetailModal } from "@/components/molecules/OrganizationDetailModal";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type Task = components["schemas"]["Task"];
type Organization = components["schemas"]["Organization"];

interface HomeProps {
  refreshKey?: number;
  organizationId?: number;
}

export function Home({ refreshKey, organizationId }: HomeProps) {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch today's tasks (due today)
      const { data: todayData } = await apiClient.GET("/api/tasks", {
        params: {
          query: {
            due_today: true,
            ...(organizationId && { organization_id: organizationId }),
          },
        },
      });
      if (todayData?.tasks) {
        setTodayTasks(todayData.tasks);
        // Set current organization from first task
        if (todayData.tasks.length > 0 && todayData.tasks[0].organization) {
          setCurrentOrganization(todayData.tasks[0].organization);
        }
      }

      // Fetch assigned tasks (my tasks sorted by due date)
      const { data: assignedData } = await apiClient.GET("/api/tasks", {
        params: {
          query: {
            assigned_to_me: true,
            sort: "due_date",
            ...(organizationId && { organization_id: organizationId }),
          },
        },
      });
      if (assignedData?.tasks) {
        setAssignedTasks(assignedData.tasks);
        // Set current organization from assigned tasks if not set
        if (!currentOrganization && assignedData.tasks.length > 0 && assignedData.tasks[0].organization) {
          setCurrentOrganization(assignedData.tasks[0].organization);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const formatDueDate = (date: string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="flex flex-col gap-12 pt-24 pb-32 w-full">
      {/* Organization Header */}
      {currentOrganization && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="text-lg font-medium text-text-primary hover:text-primary transition-colors"
          >
            {currentOrganization.name}
          </button>
        </div>
      )}

      {/* Today Section */}
      <div className="flex flex-col gap-6 w-full">
        <SectionTitle>Today</SectionTitle>
        <div className="flex gap-3 py-3 overflow-x-auto">
          {isLoading ? (
            <p className="text-text-tertiary">読み込み中...</p>
          ) : todayTasks.length === 0 ? (
            <p className="text-text-tertiary">今日のタスクはありません</p>
          ) : (
            todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueDate={formatDueDate(task.due_date)}
                description={task.description || ""}
                onClick={() => handleTaskClick(task)}
              />
            ))
          )}
        </div>
      </div>

      {/* Assigned Section */}
      <div className="flex flex-col gap-6 w-full">
        <SectionTitle>Assigned</SectionTitle>

        {isLoading ? (
          <p className="text-text-tertiary">読み込み中...</p>
        ) : assignedTasks.length === 0 ? (
          <p className="text-text-tertiary">割り当てられたタスクはありません</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,153px)] gap-3 w-full">
            {assignedTasks.map((task) => (
              <TaskCardMini
                key={task.id}
                title={task.title}
                dueDate={formatDueDate(task.due_date)}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
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
    </div>
  );
}
