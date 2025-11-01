import { DueDate } from "@/components/atoms/DueDate";

interface TaskCardProps {
  title: string;
  dueDate: string;
  description: string;
  onClick?: () => void;
}

export function TaskCard({
  title,
  dueDate,
  description,
  onClick,
}: TaskCardProps) {
  return (
    <button
      className="bg-white border border-border rounded-xl p-5 w-[194px] h-64 flex flex-col gap-2 items-start text-left shadow-lg shadow-black/5 cursor-pointer hover:shadow-md hover:opacity-80 transition-all"
      onClick={onClick}
      type="button"
    >
      <p className="font-bold text-xl text-primary whitespace-nowrap">
        {title}
      </p>
      <DueDate date={dueDate} />
      <div className="flex-1 py-2 w-full overflow-hidden">
        <p className="font-normal text-sm text-text-secondary line-clamp-8">
          {description}
        </p>
      </div>
    </button>
  );
}
