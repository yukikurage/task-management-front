"use client";

interface ButtonProps {
  children: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-white text-primary border border-primary hover:bg-primary-light",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-5 py-3 rounded-lg font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
