interface PageTitleProps {
  children: string;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <p className="font-normal text-4xl text-text-primary">
      {children}
    </p>
  );
}
