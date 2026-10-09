
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background p-8 text-foreground">
          Loading your account...
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const email = data.claims.email;

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="font-display text-3xl font-bold">
        Your Offbeat Account
      </h1>

      <p className="mt-3 text-muted-foreground">
        Signed in as {email}
      </p>

      <form action={signOut} className="mt-6">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
