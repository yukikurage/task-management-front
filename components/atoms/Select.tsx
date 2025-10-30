"use client";

interface SelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  required,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-5 py-3 border border-border rounded-lg text-base text-text-primary outline-none focus:border-primary transition-colors bg-white"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
