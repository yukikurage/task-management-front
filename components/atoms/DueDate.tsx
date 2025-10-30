import { ClockIcon } from "@/components/icons/ClockIcon";

interface DueDateProps {
  date: string;
}

export function DueDate({ date }: DueDateProps) {
  return (
    <div className="flex gap-1 items-center">
      <div className="size-3 shrink-0">
        <ClockIcon className="text-text-tertiary" />
      </div>
      <p className="font-normal text-xs text-text-tertiary whitespace-nowrap">
        {date}
      </p>
    </div>
  );
}
