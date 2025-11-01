"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { OrganizationHome } from "@/components/OrganizationHome";

export default function OrganizationPage() {
  const params = useParams();
  const organizationId = Number(params.id);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex justify-center min-h-full">
      {/* Main Container - centered content with fixed width */}
      <div className="relative w-[948px]">
        <OrganizationHome
          refreshKey={refreshKey}
          organizationId={organizationId}
          onTaskCreated={handleTaskCreated}
        />

        {/* Floating Space - Portal target for OrganizationHome to inject elements */}
        <div id="floating-space" className="absolute bottom-0 left-0 w-full pointer-events-none" />
      </div>
    </div>
  );
}
