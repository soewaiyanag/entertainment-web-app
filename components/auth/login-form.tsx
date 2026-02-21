"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await loginAction(email, password);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="w-full max-w-100 bg-blue-900 rounded-2xl p-8">
      <h1 className="text-preset-1 text-white mb-10">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email */}
        <div className="border-b border-blue-500 pb-4 focus-within:border-white transition-colors">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent text-white text-preset-4 placeholder:text-blue-500 focus:outline-none caret-red-500"
          />
        </div>

        {/* Password */}
        <div className="border-b border-blue-500 pb-4 focus-within:border-white transition-colors">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent text-white text-preset-4 placeholder:text-blue-500 focus:outline-none caret-red-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-preset-5 text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-red-500 text-white text-preset-4 py-4 rounded-lg hover:bg-white hover:text-blue-950 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Logging in…" : "Login to your account"}
        </button>

        {/* Footer */}
        <p className="text-center text-preset-4 text-blue-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-red-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
