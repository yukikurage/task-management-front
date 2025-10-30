"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
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
            アカウントを作成
          </p>
        </div>

        {/* Signup Form */}
        <SignupForm onSuccess={handleSignupSuccess} />

        {/* Link to Login */}
        <div className="text-center">
          <p className="text-sm text-text-tertiary">
            既にアカウントをお持ちですか？{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
