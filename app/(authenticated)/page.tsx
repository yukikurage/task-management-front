"use client";

import { useState } from "react";
import { Home } from "@/components/Home";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex justify-center min-h-full">
      {/* Main Container - centered content with fixed width */}
      <div className="relative w-[948px]">
        <Home refreshKey={refreshKey} onTaskCreated={handleTaskCreated} />

        {/* Floating Space - Portal target for Home to inject elements */}
        <div id="floating-space" className="absolute bottom-0 left-0 w-full pointer-events-none" />
      </div>
    </div>
  );
}
