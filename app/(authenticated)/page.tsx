"use client";

import { useState } from "react";
import { Home } from "@/components/Home";
import { ChatPanel } from "@/components/molecules/ChatPanel";
import { NewTaskButton } from "@/components/molecules/NewTaskButton";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex justify-center min-h-full">
      {/* Main Container - centered content with fixed width */}
      <div className="relative w-[948px]">
        <Home refreshKey={refreshKey} />

        {/* Floating Space - Portal target for Home to inject elements */}
        <div id="floating-space" className="absolute bottom-0 left-0 w-full pointer-events-none">
          {/* Default floating elements (can be overridden by Home via Portal) */}
          <div className="absolute bottom-[116px] right-0 pointer-events-none">
            <div className="pointer-events-auto">
              <NewTaskButton onSuccess={handleTaskCreated} />
            </div>
          </div>

          <div className="absolute bottom-8 left-0 w-full pointer-events-none">
            <div className="pointer-events-auto">
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
