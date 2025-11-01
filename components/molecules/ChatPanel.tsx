"use client";

import { useState, useRef, useEffect } from "react";
import { TaskDraftModal } from "./TaskDraftModal";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

interface ChatPanelProps {
  defaultOrganizationId?: number;
  onSuccess?: () => void;
}

type TaskDraft = Pick<
  components["schemas"]["Task"],
  "title" | "description" | "due_date"
>;

export function ChatPanel({
  defaultOrganizationId,
  onSuccess,
}: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [taskDrafts, setTaskDrafts] = useState<TaskDraft[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setIsLoading(true);
    setError("");

    try {
      const { data, error: apiError } = await apiClient.POST(
        "/api/tasks/generate",
        {
          body: {
            text: message,
          },
        }
      );

      if (apiError || !data) {
        setError("タスクの生成に失敗しました。");
        return;
      }

      if (data.tasks && data.tasks.length > 0) {
        const drafts: TaskDraft[] = data.tasks.map((task) => ({
          title: task.title,
          description: task.description,
          due_date: task.due_date ?? null,
        }));
        setTaskDrafts(drafts);
        setIsDraftModalOpen(true);
        setMessage("");
      } else {
        setError("タスクが生成されませんでした。");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError("タスクの生成中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftSuccess = () => {
    setIsDraftModalOpen(false);
    setTaskDrafts([]);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter または Ctrl+Enter で送信
    if ((e.shiftKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
    // Enter のみの場合は改行（デフォルト動作）
  };

  // textareaの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 高さをリセットして正確な scrollHeight を取得
      textarea.style.height = "48px";
      // 内容に応じて高さを設定（最小48px、最大300px）
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, 48), 300);
      textarea.style.height = `${newHeight}px`;

      // 最大高さに達した場合のみスクロールを有効化
      if (scrollHeight > 300) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  }, [message]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl py-3 flex flex-col gap-2"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="chat panel (Shift/Ctrl+Enter で送信)"
          rows={1}
          disabled={isLoading}
          className="flex-1 font-normal text-base text-gray-800 placeholder:text-gray-400 outline-none bg-white border border-primary rounded-3xl px-5 py-3 transition-shadow shadow-md focus:shadow-xl shadow-black/5 focus:shadow-teal-500/10 resize-none overflow-y-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {error && <p className="text-sm text-error px-2">{error}</p>}
      </form>

      <TaskDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onSuccess={handleDraftSuccess}
        drafts={taskDrafts}
        defaultOrganizationId={defaultOrganizationId}
      />
    </>
  );
}
