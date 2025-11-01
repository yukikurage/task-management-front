"use client";

import { TaskCardMini } from "@/components/molecules/TaskCardMini";
import { components } from "@/lib/api-schema";

type TaskSummary = components["schemas"]["TaskListItem"];

interface TaskCardGridProps {
  tasks: TaskSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
  onTaskClick: (task: TaskSummary) => void;
}

export function TaskCardGrid({
  tasks,
  isLoading = false,
  emptyMessage = "タスクはありません",
  onTaskClick,
}: TaskCardGridProps) {
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
    <div className="grid grid-cols-[repeat(auto-fill,153px)] gap-3 w-full">
      {tasks.map((task) => (
        <TaskCardMini
          key={task.id}
          title={task.title}
          dueDate={formatDueDate(task.due_date)}
          onClick={() => onTaskClick(task)}
        />
      ))}
    </div>
  );
}
