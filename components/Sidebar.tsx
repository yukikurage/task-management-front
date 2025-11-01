"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { JoinOrganizationModal } from "@/components/molecules/JoinOrganizationModal";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";
import {
  ArrowRightOnRectangleIcon,
  PlusSmallIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

type Organization = components["schemas"]["Organization"];
type User = components["schemas"]["User"];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const fetchSidebarData = useCallback(async () => {
    try {
      const [{ data: userData }, { data: orgsData }] = await Promise.all([
        apiClient.GET("/api/auth/me"),
        apiClient.GET("/api/organizations"),
      ]);

      if (userData) {
        setCurrentUser(userData);
      }

      if (orgsData?.organizations) {
        setOrganizations(orgsData.organizations);
      }
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  const handleLogout = async () => {
    await apiClient.POST("/api/auth/logout");
    router.push("/login");
  };

  const handleOrgClick = (orgId: number) => {
    router.push(`/organizations/${orgId}`);
  };

  const handleOrganizationUpdate = async () => {
    setIsLoading(true);
    await fetchSidebarData();
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
      <Navigation
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
          <PlusSmallIcon className="h-5 w-5 shrink-0 text-text-secondary" />
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
            <Navigation
              key={org.id}
              label={org.name}
              onClick={() => handleOrgClick(org.id)}
              isActive={pathname === `/organizations/${org.id}`}
            />
          ))
        )}
      </div>

      {/* User Profile */}
      <div className="relative w-full">
        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="flex gap-2.5 h-12 items-center px-3 py-2 rounded-lg w-full hover:bg-neutral-100 transition-colors"
        >
          <div className="size-4 shrink-0">
            <UserIcon className="text-text-secondary" />
          </div>
          <p className="font-bold text-base text-text-secondary whitespace-nowrap">
            {currentUser?.username || "アカウント"}
          </p>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute bottom-14 left-0 w-full rounded-lg border border-border bg-white shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between px-4 h-12 text-sm font-medium text-text-secondary hover:bg-neutral-100 transition-colors"
            >
              <span>ログアウト</span>
              <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0 text-text-tertiary" />
            </button>
          </div>
        )}
      </div>

      {/* Join Organization Modal */}
      <JoinOrganizationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleOrganizationUpdate}
      />
    </div>
  );
}
