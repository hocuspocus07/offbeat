import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";

export default async function AccountPage() {
  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const email = data.claims.email;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Your Offbeat account</h1>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Signed in as</p>
          <p className="mt-2 text-lg">{email}</p>
        </section>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-700 px-5 py-3 hover:bg-zinc-800"
          >
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}