"use client";

import { useState, useRef, useEffect } from "react";

export function ChatPanel() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;
    // TODO: Implement chat functionality
    console.log("Message:", message);
    setMessage("");
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
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl py-3 flex items-center gap-2.5"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="chat panel (Shift/Ctrl+Enter で送信)"
        rows={1}
        className="flex-1 font-normal text-base text-gray-800 placeholder:text-gray-400 outline-none bg-white border border-primary rounded-3xl px-5 py-3 transition-shadow shadow-md focus:shadow-xl shadow-black/5 focus:shadow-teal-500/10 resize-none overflow-y-hidden"
      />
    </form>
  );
}
