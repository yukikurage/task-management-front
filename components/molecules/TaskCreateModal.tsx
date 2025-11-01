"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Select } from "@/components/atoms/Select";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";
import { Button } from "../atoms/Button";

type Organization = components["schemas"]["Organization"];

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultOrganizationId?: number;
}

export function TaskCreateModal({
  isOpen,
  onClose,
  onSuccess,
  defaultOrganizationId,
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
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

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) {
      setError("組織名を入力してください。");
      return;
    }

    setIsCreatingOrg(true);
    setError("");

    try {
      const { data, error: apiError } = await apiClient.POST(
        "/api/organizations",
        {
          body: {
            name: newOrgName,
          },
        }
      );

      if (apiError || !data) {
        setError("組織の作成に失敗しました。");
        return;
      }

      // Add new organization to list and select it
      setOrganizations([...organizations, data]);
      setOrganizationId(String(data.id));
      setNewOrgName("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("組織の作成中にエラーが発生しました。");
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!organizationId) {
      setError("組織を選択してください。");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: apiError } = await apiClient.POST("/api/tasks", {
        body: {
          title,
          description,
          organization_id: Number(organizationId),
          due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        },
      });

      if (apiError || !data) {
        setError("タスクの作成に失敗しました。");
        return;
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
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
    setTitle("");
    setDescription("");
    setDueDate("");
    setOrganizationId("");
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
        className="bg-white rounded-xl border border-border w-full max-w-2xl min-h-[548px] p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-normal text-text-primary">New Task</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Organization */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Organization <span className="text-error">*</span>
            </label>
            {isLoadingOrgs ? (
              <div className="px-4 py-2.5 text-text-tertiary">Loading...</div>
            ) : organizations.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-text-tertiary">
                  No organizations found. Create a new one.
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter organization name"
                      value={newOrgName}
                      onChange={setNewOrgName}
                    />
                  </div>
                  <Button
                    onClick={handleCreateOrganization}
                    variant="primary"
                    disabled={isCreatingOrg}
                  >
                    {isCreatingOrg ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            ) : (
              <Select
                value={organizationId}
                onChange={setOrganizationId}
                options={organizations.map((org) => ({
                  value: org.id,
                  label: org.name,
                }))}
                placeholder="Select organization"
                required
              />
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Title <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={setTitle}
              required
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              Due Date
            </label>
            <Input type="date" value={dueDate} onChange={setDueDate} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium text-text-secondary">
              Description
            </label>
            <Textarea
              placeholder="Enter task description"
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={handleClose}
              variant="tertiary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              variant="primary"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
