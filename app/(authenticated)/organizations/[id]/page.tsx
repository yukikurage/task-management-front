"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Home } from "@/components/Home";
import { ChatPanel } from "@/components/molecules/ChatPanel";
import { NewTaskButton } from "@/components/molecules/NewTaskButton";
import { OrganizationDetailModal } from "@/components/molecules/OrganizationDetailModal";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type Organization = components["schemas"]["Organization"];

export default function OrganizationPage() {
  const params = useParams();
  const organizationId = Number(params.id);
  const [refreshKey, setRefreshKey] = useState(0);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data } = await apiClient.GET("/api/organizations/{id}", {
          params: {
            path: {
              id: organizationId,
            },
          },
        });
        if (data?.organization) {
          setOrganization(data.organization);
        }
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId]);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex justify-center min-h-full">
      {/* Main Container - centered content with fixed width */}
      <div className="relative w-[948px]">
        {/* Organization Header */}
        {organization && (
          <div className="pt-24 pb-6">
            <button
              onClick={() => setIsOrgModalOpen(true)}
              className="text-lg font-medium text-text-primary hover:text-primary transition-colors"
            >
              {organization.name}
            </button>
          </div>
        )}

        <Home refreshKey={refreshKey} organizationId={organizationId} />

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

      {/* Organization Detail Modal */}
      {organization && (
        <OrganizationDetailModal
          isOpen={isOrgModalOpen}
          onClose={() => setIsOrgModalOpen(false)}
          organizationId={organization.id}
        />
      )}
    </div>
  );
}
