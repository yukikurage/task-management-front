"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md flex flex-col gap-12 items-center">
        {/* Logo */}
        <div className="flex flex-col gap-4 items-center">
          <h1 className="font-montserrat font-normal text-4xl tracking-[2.4px] text-text-secondary">
            TASKER
          </h1>
          <p className="text-base text-text-tertiary">
            タスク管理システムにログイン
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Link to Signup */}
        <div className="text-center">
          <p className="text-sm text-text-tertiary">
            アカウントをお持ちでないですか？{" "}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
