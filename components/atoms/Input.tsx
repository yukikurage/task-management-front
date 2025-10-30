interface InputProps {
  type?: "text" | "email" | "password" | "date";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-5 py-3 border border-border rounded-lg text-base text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary transition-colors"
    />
  );
}
