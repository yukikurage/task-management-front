"use client";

import { useState } from "react";
import { TaskCreateModal } from "./TaskCreateModal";

export function NewTaskButton({ onSuccess }: { onSuccess?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-white shadow-black/5 shadow-md hover:shadow-lg hover:opacity-80 transition-all flex items-center justify-center cursor-pointer"
        aria-label="New Task"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
