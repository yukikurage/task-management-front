import { Sidebar } from "@/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="absolute left-0 top-0 w-[292px] h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="absolute left-[292px] top-0 right-0 h-full bg-white border border-border overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
