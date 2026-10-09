"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email.includes("@") || password.length < 8) {
    redirect("/signup?error=invalid-input");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("[Offbeat signup] Supabase error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    redirect(`/signup?error=${encodeURIComponent("signup-failed")}`);
  }

  console.log("[Offbeat signup] Supabase response:", {
  userCreated: Boolean(data.user),
  sessionCreated: Boolean(data.session),
});
  // Projects with email confirmation enabled may not
  // create a session until the user confirms their email.
  if (data.session) {
    redirect("/account");
  }

  redirect("/signup?message=check-email");
}

export async function login(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email.includes("@") || !password) {
    redirect("/login?error=invalid-input");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid-credentials");
  }

  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut({ scope: "local" });

  redirect("/login");
}
