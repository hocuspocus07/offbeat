"use client";

import { useSearchParams } from "next/navigation";

export function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const message =
    error === "invalid-input"
      ? "Enter your email and password."
      : "Invalid email or password.";

  return (
    <p
      role="alert"
      className="rounded-lg bg-red-950 p-3 text-sm text-red-300"
    >
      {message}
    </p>
  );
}