"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { apiClient } from "@/lib/api-client";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: apiError } = await apiClient.POST("/api/auth/login", {
        body: {
          username,
          password,
        },
      });

      if (apiError || !data) {
        setError("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
        return;
      }

      onSuccess();
    } catch (err) {
      setError("ログイン中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={setUsername}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={setPassword}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-error text-center">{error}</p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "ログイン中..." : "ログイン"}
      </Button>
    </form>
  );
}
