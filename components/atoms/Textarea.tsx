interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}

export function Textarea({
  placeholder,
  value,
  onChange,
  rows = 4,
  required,
}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      required={required}
      className="w-full px-5 py-3 border border-border rounded-lg text-base text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary transition-colors resize-none"
    />
  );
}
