"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { CreateOrganizationModal } from "./CreateOrganizationModal";
import { apiClient } from "@/lib/api-client";

interface JoinOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
}: JoinOrganizationModalProps) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inviteCode.trim()) {
      setError("招待コードを入力してください。");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: apiError } = await apiClient.POST(
        "/api/organizations/join",
        {
          body: {
            invite_code: inviteCode,
          },
        }
      );

      if (apiError || !data) {
        setError("組織への参加に失敗しました。招待コードを確認してください。");
        return;
      }

      setInviteCode("");
      onClose();
      // Navigate to the organization page
      router.push(`/organizations/${data.organization.id}`);
    } catch (err) {
      setError("組織への参加中にエラーが発生しました。");
      console.error("Error joining organization:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInviteCode("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-md p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-normal text-text-primary">
            Join Organization
          </h2>
          <p className="text-sm text-text-tertiary">
            招待コードを入力して組織に参加します
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Invite Code */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Invite Code <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="例: 5dc6-6411-e229"
              value={inviteCode}
              onChange={setInviteCode}
              required
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Joining..." : "Join"}
            </button>
          </div>

          {/* Create Organization Link */}
          <div className="text-center pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setIsCreateModalOpen(true);
              }}
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              新しい組織を作成
            </button>
          </div>
        </form>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(orgId) => {
          setIsCreateModalOpen(false);
          router.push(`/organizations/${orgId}`);
        }}
      />
    </div>
  );
}
