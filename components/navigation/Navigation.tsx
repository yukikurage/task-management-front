import { ReactNode } from "react";

export interface NavigationProps {
  variant?: "home" | "default";
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function Navigation({
  variant = "default",
  icon,
  label,
  onClick,
  isActive = false,
}: NavigationProps) {
  const baseClasses =
    "h-12 rounded-lg border w-full max-w-[280px] cursor-pointer";
  const contentClasses = "flex h-12 items-center px-5 py-2 gap-2.5";
  const textClasses = "font-bold text-base whitespace-nowrap";

  const variantClasses = {
    home: {
      container: "bg-nav-home-bg border-nav-home-border",
      text: "text-nav-home-text",
    },
    default: {
      container: "bg-nav-default-bg border-nav-default-border",
      text: "text-nav-default-text",
    },
  };

  // Active state overrides variant styles
  const containerClasses = isActive
    ? "bg-home-bg border-primary"
    : variantClasses[variant].container;

  const textColorClasses = isActive
    ? "text-primary"
    : variantClasses[variant].text;

  return (
    <button
      className={`${baseClasses} ${containerClasses}`}
      onClick={onClick}
      type="button"
    >
      <div className={contentClasses}>
        {icon && <div className="size-5 shrink-0">{icon}</div>}
        <p className={`${textClasses} ${textColorClasses}`}>{label}</p>
      </div>
    </button>
  );
}
