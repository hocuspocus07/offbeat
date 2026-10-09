
import { Suspense } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import {LoginError} from "@/app/(auth)/login/login-error"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Pick up where you left off.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginError />
        </Suspense>

        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-green-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 p-3 font-semibold text-black transition hover:bg-green-400"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          New to Offbeat?{" "}
          <Link
            href="/signup"
            className="text-green-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
