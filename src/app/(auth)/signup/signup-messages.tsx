"use client";

import { useSearchParams } from "next/navigation";

export function SignupMessages() {
  const params = useSearchParams();
  const error = params.get("error");
  const message = params.get("message");

  return (
    <>
      {message === "check-email" && (
        <p className="rounded-lg bg-green-950 p-3 text-sm text-green-300">
          Check your email to confirm your account.
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-950 p-3 text-sm text-red-300"
        >
          {error === "invalid-input"
            ? "Enter a valid email and a password of at least 8 characters."
            : "We couldn't create your account. Check your details and try again."}
        </p>
      )}
    </>
  );
}