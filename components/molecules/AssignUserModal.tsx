"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type OrganizationMember = components["schemas"]["OrganizationMember"];

interface AssignUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  organizationId: number;
  currentAssignments: number[];
  onSuccess: () => void;
}

export function AssignUserModal({
  isOpen,
  onClose,
  taskId,
  organizationId,
  currentAssignments,
  onSuccess,
}: AssignUserModalProps) {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, organizationId]);

  const fetchMembers = async () => {
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

      if (data?.members) {
        setMembers(data.members);
      }
    } catch (err) {
      setError("メンバー情報の取得に失敗しました。");
      console.error("Failed to fetch members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserIds.length === 0) {
      setError("ユーザーを選択してください。");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { error: apiError } = await apiClient.POST("/api/tasks/{id}/assign", {
        params: {
          path: {
            id: taskId,
          },
        },
        body: {
          user_ids: selectedUserIds,
        },
      });

      if (apiError) {
        setError("ユーザーの割り当てに失敗しました。");
        return;
      }

      setSelectedUserIds([]);
      onSuccess();
      onClose();
    } catch (err) {
      setError("ユーザーの割り当て中にエラーが発生しました。");
      console.error("Error assigning users:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUserIds([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  // Filter out already assigned users
  const availableMembers = members.filter(
    (member) => !currentAssignments.includes(member.user_id)
  );

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
          <h2 className="text-2xl font-normal text-text-primary">Assign Users</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* User List */}
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-text-tertiary">読み込み中...</p>
            ) : availableMembers.length === 0 ? (
              <p className="text-text-tertiary">割り当て可能なユーザーがいません。</p>
            ) : (
              availableMembers.map((member) => (
                <label
                  key={member.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(member.user_id)}
                    onChange={() => handleToggleUser(member.user_id)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm font-medium text-text-secondary">
                    <span className="text-text-tertiary">@</span>
                    {member.user?.username}
                  </span>
                </label>
              ))
            )}
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
              disabled={isSubmitting || selectedUserIds.length === 0}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
