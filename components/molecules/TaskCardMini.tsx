import { DueDate } from "@/components/atoms/DueDate";

interface TaskCardMiniProps {
  title: string;
  dueDate: string;
  onClick?: () => void;
}

export function TaskCardMini({ title, dueDate, onClick }: TaskCardMiniProps) {
  return (
    <button
      className="bg-white border border-border rounded-lg px-5 w-[153px] h-[83px] flex flex-col gap-2 items-start justify-center text-left cursor-pointer shadow-md shadow-black/5 hover:opacity-80 hover:shadow-sm transition-all"
      onClick={onClick}
      type="button"
    >
      <p className="font-bold text-base text-primary overflow-hidden text-ellipsis w-full line-clamp-1">
        {title}
      </p>
      <DueDate date={dueDate} />
    </button>
  );
}
