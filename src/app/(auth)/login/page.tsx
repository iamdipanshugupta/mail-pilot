"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f9d8a] text-white">
            <Mail className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#1c1b1a]">
            MailPilot
          </span>
        </Link>

        <div className="rounded-2xl border border-[#e8e2d6] bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-[#1c1b1a]">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-[#8a8275]">
            Sign in with Google to access your inbox, calendar and AI
            assistant.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/inbox" })}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[#e8e2d6] bg-white px-4 py-3 text-sm font-semibold text-[#3f3a33] shadow-sm transition-colors hover:bg-[#f7f3ea]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.48-1.13 2.73-2.4 3.57v2.97h3.87c2.27-2.09 3.55-5.17 3.55-8.57z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-2.97c-1.07.72-2.45 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.27v3.06C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.31a7.2 7.2 0 0 1 0-4.62V6.63H1.27a11.96 11.96 0 0 0 0 10.74l4-3.06z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.18 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.06C6.22 6.84 8.87 4.75 12 4.75z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-[#a39c8e]">
            By continuing, you agree to MailPilot&apos;s{" "}
            <a href="#" className="underline hover:text-[#6b6358]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-[#6b6358]">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#8a8275]">
          <Link href="/" className="hover:text-[#3f3a33]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
