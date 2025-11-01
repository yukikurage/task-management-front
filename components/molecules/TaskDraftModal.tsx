"use client";

import { useState, useEffect, useCallback } from "react";
import { Select } from "@/components/atoms/Select";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

type Organization = components["schemas"]["Organization"];
type TaskDraft = Pick<
  components["schemas"]["Task"],
  "title" | "description" | "due_date"
>;

interface TaskDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  drafts: TaskDraft[];
  defaultOrganizationId?: number;
}

export function TaskDraftModal({
  isOpen,
  onClose,
  onSuccess,
  drafts,
  defaultOrganizationId,
}: TaskDraftModalProps) {
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [error, setError] = useState("");

  const fetchOrganizations = useCallback(async () => {
    setIsLoadingOrgs(true);
    try {
      const { data } = await apiClient.GET("/api/organizations");
      if (data?.organizations) {
        setOrganizations(data.organizations);
        // Set default organization if provided, otherwise use first organization
        if (!organizationId) {
          if (defaultOrganizationId) {
            setOrganizationId(String(defaultOrganizationId));
          } else if (data.organizations.length > 0) {
            setOrganizationId(String(data.organizations[0].id));
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setIsLoadingOrgs(false);
    }
  }, [defaultOrganizationId, organizationId]);

  useEffect(() => {
    if (isOpen) {
      fetchOrganizations();
    }
  }, [fetchOrganizations, isOpen]);

  const handleAddTasks = async () => {
    if (!organizationId) {
      setError("組織を選択してください。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create all tasks in parallel
      const promises = drafts.map((draft) =>
        apiClient.POST("/api/tasks", {
          body: {
            title: draft.title,
            description: draft.description,
            due_date: draft.due_date ?? undefined,
            organization_id: Number(organizationId),
          },
        })
      );

      const results = await Promise.all(promises);

      // Check if any failed
      const failures = results.filter((result) => result.error);
      if (failures.length > 0) {
        setError(`${failures.length}個のタスクの作成に失敗しました。`);
        return;
      }

      // Success - reset and close
      setOrganizationId("");
      onSuccess();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("タスクの作成中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOrganizationId("");
    setError("");
    onClose();
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (Number.isNaN(date.getTime())) return dueDate;
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[80vh] p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-normal text-text-primary">
            AI生成タスク
          </h2>
          <p className="text-sm text-text-secondary">
            {drafts.length}個のタスクが生成されました
          </p>
        </div>

        {/* Task Drafts List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {drafts.map((draft, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-4 flex flex-col gap-3"
            >
              <h3 className="font-medium text-text-primary">{draft.title}</h3>
              {draft.description && (
                <p className="text-sm text-text-secondary">
                  {draft.description}
                </p>
              )}
              {draft.due_date && (
                <p className="text-xs font-medium text-primary">
                  期限: {formatDueDate(draft.due_date)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Organization Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-secondary">
            追加先の組織 <span className="text-error">*</span>
          </label>
          {isLoadingOrgs ? (
            <div className="px-4 py-2.5 text-text-tertiary">Loading...</div>
          ) : (
            <Select
              value={organizationId}
              onChange={setOrganizationId}
              options={organizations.map((org) => ({
                value: org.id,
                label: org.name,
              }))}
              placeholder="組織を選択"
              required
            />
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
            キャンセル
          </button>
          <button
            onClick={handleAddTasks}
            disabled={isLoading || !organizationId}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "追加中..." : "タスクを追加"}
          </button>
        </div>
      </div>
    </div>
  );
}
