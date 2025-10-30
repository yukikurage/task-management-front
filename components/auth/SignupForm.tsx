"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { apiClient } from "@/lib/api-client";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります。");
      return;
    }

    setIsLoading(true);

    try {
      // Signup
      const { data, error: apiError } = await apiClient.POST("/api/auth/signup", {
        body: {
          username,
          password,
        },
      });

      if (apiError || !data) {
        setError("アカウントの作成に失敗しました。ユーザー名が既に使用されている可能性があります。");
        return;
      }

      // Verify cookies are set by checking auth status
      const { data: authData, error: authError } = await apiClient.GET("/api/auth/me");

      if (authError || !authData) {
        // Cookies not set, redirect to login
        router.push("/login");
        return;
      }

      // Cookies are set, proceed to home
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("アカウント作成中にエラーが発生しました。");
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
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={setPassword}
          required
        />
        <Input
          type="password"
          placeholder="パスワード（確認）"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-error text-center">{error}</p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "作成中..." : "アカウント作成"}
      </Button>
    </form>
  );
}
