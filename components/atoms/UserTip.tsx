"use client";

interface UserTipProps {
  username: string;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function UserTip({ username, onDelete, showDelete = false }: UserTipProps) {
  return (
    <div className="px-3 py-1.5 bg-white border border-border rounded-full flex items-center gap-1">
      <p className="text-xs font-medium">
        <span className="text-text-tertiary">@</span>
        <span className="text-text-secondary">{username}</span>
      </p>
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
