"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";
import { UserTip } from "@/components/atoms/UserTip";
import { Button } from "../atoms/Button";

type Organization = components["schemas"]["Organization"];
type OrganizationMember = components["schemas"]["OrganizationMember"];

interface OrganizationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

export function OrganizationDetailModal({
  isOpen,
  onClose,
  organizationId,
}: OrganizationDetailModalProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [yourRole, setYourRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchOrganizationDetails = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await apiClient.GET("/api/organizations/{id}", {
        params: {
          path: {
            id: organizationId,
          },
        },
      });

      if (data) {
        setOrganization(data);
        setMembers(data.members || []);
        setYourRole(data.your_role || "");
      }
    } catch (err) {
      setError("組織情報の取得に失敗しました。");
      console.error("Failed to fetch organization details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (isOpen && organizationId) {
      fetchOrganizationDetails();
    }
  }, [isOpen, organizationId, fetchOrganizationDetails]);

  const handleCopyInviteCode = () => {
    if (organization?.invite_code) {
      navigator.clipboard.writeText(organization.invite_code);
    }
  };

  const handleRegenerateCode = async () => {
    if (!organizationId) return;

    setIsRegenerating(true);
    setError("");

    try {
      const { data, error: apiError } = await apiClient.POST(
        "/api/organizations/{id}/regenerate-code",
        {
          params: {
            path: {
              id: organizationId,
            },
          },
        }
      );

      if (apiError || !data) {
        setError("招待コードの更新に失敗しました。");
        return;
      }

      // Update organization with new invite code
      setOrganization(data);
    } catch (err) {
      setError("招待コードの更新中にエラーが発生しました。");
      console.error("Error regenerating invite code:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-2xl min-h-[548px] p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-normal text-text-primary">
            {organization?.name || "組織詳細"}
          </h2>
          <p className="text-sm text-text-tertiary">
            Role: <span className="font-medium">{yourRole}</span>
          </p>
        </div>

        {isLoading ? (
          <p className="text-text-tertiary">読み込み中...</p>
        ) : error ? (
          <p className="text-error">{error}</p>
        ) : (
          <>
            {/* Invite Code */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Invite Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-2 bg-gray-50 border border-border rounded-lg text-text-primary font-mono">
                  {organization?.invite_code}
                </div>
                <Button onClick={handleCopyInviteCode} variant="primary">
                  Copy
                </Button>
                {yourRole === "owner" && (
                  <Button
                    onClick={handleRegenerateCode}
                    variant="secondary"
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                )}
              </div>
            </div>

            {/* Members */}
            <div className="flex flex-col gap-3 flex-1">
              <label className="text-sm font-medium text-text-secondary">
                Members ({members.length})
              </label>
              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-64">
                {members.map((member) => (
                  <UserTip
                    key={member.user.id}
                    username={member.user.username}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute bottom-8 left-8 px-0 py-1.5 text-xs font-bold text-text-tertiary hover:text-text-secondary transition-colors"
        >
          ← back
        </button>
      </div>
    </div>
  );
}
