"use client";

import { TaskCard } from "@/components/molecules/TaskCard";
import { components } from "@/lib/api-schema";

type TaskSummary = components["schemas"]["TaskListItem"];

interface TaskCardListProps {
  tasks: TaskSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
  onTaskClick: (task: TaskSummary) => void;
}

export function TaskCardList({
  tasks,
  isLoading = false,
  emptyMessage = "タスクはありません",
  onTaskClick,
}: TaskCardListProps) {
  const formatDueDate = (date: string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  if (isLoading) {
    return <p className="text-text-tertiary">読み込み中...</p>;
  }

  if (tasks.length === 0) {
    return <p className="text-text-tertiary">{emptyMessage}</p>;
  }

  return (
    <div className="flex gap-3 py-3 overflow-x-auto">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          dueDate={formatDueDate(task.due_date)}
          description={task.description || ""}
          onClick={() => onTaskClick(task)}
        />
      ))}
    </div>
  );
}
