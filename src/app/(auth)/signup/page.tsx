import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { Suspense } from "react";
import { SignupMessages } from "@/app/(auth)/signup/signup-messages";


export default async function SignupPage() {

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
            <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                <div>
                    <h1 className="text-3xl font-bold">Join Offbeat.</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Create your account and build your music library.
                    </p>
                </div>

                <Suspense fallback={null}>
                    <SignupMessages />
                </Suspense>

                <form action={signUp} className="space-y-4">
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
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-green-500"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-green-500 p-3 font-semibold text-black transition hover:bg-green-400"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-400">
                    Already registered?{" "}
                    <Link href="/login" className="text-green-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}