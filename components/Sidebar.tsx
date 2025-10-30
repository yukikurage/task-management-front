"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HomeNav, Nav } from "@/components/navigation";
import { UserIcon } from "@/components/navigation/UserIcon";
import { JoinOrganizationModal } from "@/components/molecules/JoinOrganizationModal";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type Organization = components["schemas"]["Organization"];
type User = components["schemas"]["User"];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const { data: userData } = await apiClient.GET("/api/auth/me");
        if (userData) {
          setCurrentUser(userData);
        }

        // Fetch organizations
        const { data: orgsData } = await apiClient.GET("/api/organizations");
        if (orgsData?.organizations) {
          setOrganizations(orgsData.organizations);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
        // Redirect to login if unauthorized
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await apiClient.POST("/api/auth/logout");
    router.push("/login");
  };

  const handleOrgClick = (orgId: number) => {
    router.push(`/organizations/${orgId}`);
  };

  const handleJoinSuccess = () => {
    // Refresh organizations and navigate handled by modal
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2 h-full items-center p-4 w-full">
      {/* Logo/Title */}
      <div className="flex flex-col gap-2.5 items-start justify-center p-2.5 w-full">
        <p className="font-montserrat font-normal text-xl tracking-[2.4px] text-text-secondary">
          TASKER
        </p>
      </div>

      {/* Divider */}
      <div className="flex flex-col items-center justify-center px-6 py-3 w-full">
        <div className="border-t border-border w-full" />
      </div>

      {/* Home Navigation */}
      <Nav
        label="Home"
        onClick={() => router.push("/")}
        isActive={pathname === "/"}
      />

      {/* Divider */}
      <div className="flex flex-col items-center justify-center px-6 py-3 w-full">
        <div className="border-t border-border w-full" />
      </div>

      {/* Organizations Section */}
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={() => setIsJoinModalOpen(true)}
          className="flex gap-2.5 items-center px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors w-full"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M9 1V17M1 9H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm font-bold text-text-secondary">組織の追加</p>
        </button>
      </div>

      {/* Organizations List */}
      <div className="flex flex-col gap-3 grow overflow-y-auto w-full">
        {isLoading ? (
          <p className="text-sm text-text-tertiary px-3">読み込み中...</p>
        ) : organizations.length === 0 ? (
          <p className="text-sm text-text-tertiary px-3">組織がありません</p>
        ) : (
          organizations.map((org) => (
            <Nav
              key={org.id}
              label={org.name}
              onClick={() => handleOrgClick(org.id)}
              isActive={pathname === `/organizations/${org.id}`}
            />
          ))
        )}
      </div>

      {/* User Info */}
      <button
        onClick={handleLogout}
        className="flex gap-2.5 h-12 items-center px-3 py-2 rounded-lg w-full hover:bg-neutral-100 transition-colors"
      >
        <div className="size-4 shrink-0">
          <UserIcon className="text-text-secondary" />
        </div>
        <p className="font-bold text-base text-text-secondary whitespace-nowrap">
          {currentUser?.username || "ログアウト"}
        </p>
      </button>

      {/* Join Organization Modal */}
      <JoinOrganizationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
}
