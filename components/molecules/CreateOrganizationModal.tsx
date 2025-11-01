"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { apiClient } from "@/lib/api-client";
import { Button } from "../atoms/Button";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (organizationId: number) => void;
}

export function CreateOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrganizationModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("組織名を入力してください。");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: apiError } = await apiClient.POST(
        "/api/organizations",
        {
          body: {
            name,
          },
        }
      );

      if (apiError || !data) {
        setError("組織の作成に失敗しました。");
        return;
      }

      setName("");
      onSuccess(data.id);
      onClose();
    } catch (err) {
      setError("組織の作成中にエラーが発生しました。");
      console.error("Error creating organization:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
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
            Create New Organization
          </h2>
          <p className="text-sm text-text-tertiary">新しい組織を作成します</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Organization Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Organization Name <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter organization name"
              value={name}
              onChange={setName}
              required
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button onClick={handleClose} variant="tertiary" type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
