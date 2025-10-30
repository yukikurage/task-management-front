interface SectionTitleProps {
  children: string;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <p className="font-normal text-base text-text-primary">{children}</p>;
}
