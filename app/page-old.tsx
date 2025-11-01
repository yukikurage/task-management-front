"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { components } from "@/lib/api-schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"auth" | "orgs" | "tasks">("auth");
  const [response, setResponse] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<
    components["schemas"]["User"] | null
  >(null);

  // Auth handlers
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data, error } = await apiClient.POST("/api/auth/signup", {
      body: {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data, error } = await apiClient.POST("/api/auth/login", {
      body: {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      },
    });
    if (data) setCurrentUser(data);
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleLogout = async () => {
    const { data, error } = await apiClient.POST("/api/auth/logout");
    setCurrentUser(null);
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleGetMe = async () => {
    const { data, error } = await apiClient.GET("/api/auth/me");
    if (data) setCurrentUser(data);
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleHealthCheck = async () => {
    const { data, error } = await apiClient.GET("/health");
    setResponse(JSON.stringify(data || error, null, 2));
  };

  // Organization handlers
  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data, error } = await apiClient.POST("/api/organizations", {
      body: {
        name: formData.get("name") as string,
      },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleListOrgs = async () => {
    const { data, error } = await apiClient.GET("/api/organizations");
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleJoinOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data, error } = await apiClient.POST("/api/organizations/join", {
      body: {
        invite_code: formData.get("invite_code") as string,
      },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleGetOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orgId = parseInt(formData.get("org_id") as string);
    const { data, error } = await apiClient.GET("/api/organizations/{id}", {
      params: { path: { id: orgId } },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  // Task handlers
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Convert datetime-local to RFC3339 format
    let dueDate: string | undefined = undefined;
    const dueDateInput = formData.get("due_date") as string;
    if (dueDateInput) {
      const date = new Date(dueDateInput);
      dueDate = date.toISOString(); // ISO 8601 / RFC3339 format
    }

    const { data, error } = await apiClient.POST("/api/tasks", {
      body: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        organization_id: parseInt(formData.get("organization_id") as string),
        due_date: dueDate,
      },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleListTasks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orgId = formData.get("org_id") as string;
    const { data, error } = await apiClient.GET("/api/tasks", {
      params: {
        query: orgId ? { organization_id: parseInt(orgId) } : {},
      },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  const handleGetTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskId = parseInt(formData.get("task_id") as string);
    const { data, error } = await apiClient.GET("/api/tasks/{id}", {
      params: { path: { id: taskId } },
    });
    setResponse(JSON.stringify(data || error, null, 2));
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Task Management API Test</h1>

        {currentUser && (
          <div className="mb-4 p-4 bg-green-100 rounded">
            Logged in as: {currentUser.username}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={handleHealthCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Health Check
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("auth")}
            className={`px-4 py-2 rounded ${
              activeTab === "auth" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Auth
          </button>
          <button
            onClick={() => setActiveTab("orgs")}
            className={`px-4 py-2 rounded ${
              activeTab === "orgs" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Organizations
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded ${
              activeTab === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Tasks
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {activeTab === "auth" && (
              <>
                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Signup</h2>
                  <form onSubmit={handleSignup} className="space-y-2">
                    <input
                      name="username"
                      placeholder="Username"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Signup
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Login</h2>
                  <form onSubmit={handleLogin} className="space-y-2">
                    <input
                      name="username"
                      placeholder="Username"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Login
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">User Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={handleGetMe}
                      className="w-full px-4 py-2 bg-purple-500 text-white rounded"
                    >
                      Get Current User
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "orgs" && (
              <>
                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">
                    Create Organization
                  </h2>
                  <form onSubmit={handleCreateOrg} className="space-y-2">
                    <input
                      name="name"
                      placeholder="Organization Name"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Create
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">List Organizations</h2>
                  <button
                    onClick={handleListOrgs}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    List My Organizations
                  </button>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Join Organization</h2>
                  <form onSubmit={handleJoinOrg} className="space-y-2">
                    <input
                      name="invite_code"
                      placeholder="Invite Code"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-purple-500 text-white rounded"
                    >
                      Join
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Get Organization</h2>
                  <form onSubmit={handleGetOrg} className="space-y-2">
                    <input
                      name="org_id"
                      type="number"
                      placeholder="Organization ID"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Get Details
                    </button>
                  </form>
                </div>
              </>
            )}

            {activeTab === "tasks" && (
              <>
                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Create Task</h2>
                  <form onSubmit={handleCreateTask} className="space-y-2">
                    <input
                      name="title"
                      placeholder="Task Title"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      name="organization_id"
                      type="number"
                      placeholder="Organization ID"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      name="due_date"
                      type="datetime-local"
                      placeholder="Due Date"
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Create Task
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">List Tasks</h2>
                  <form onSubmit={handleListTasks} className="space-y-2">
                    <input
                      name="org_id"
                      type="number"
                      placeholder="Organization ID (optional)"
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      List Tasks
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4">Get Task</h2>
                  <form onSubmit={handleGetTask} className="space-y-2">
                    <input
                      name="task_id"
                      type="number"
                      placeholder="Task ID"
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Get Task
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px] text-sm">
              {response || "Response will appear here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
