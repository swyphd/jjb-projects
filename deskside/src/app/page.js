import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/devices");
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight mb-4">Deskside</h1>
      <p className="max-w-md text-lg mb-8" style={{ color: "var(--muted)" }}>
        Log the tech you own, and get an AI agent that actually knows your gear —
        compatibility answers grounded in what you have, plus everyday IT help.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: "var(--brand)" }}
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg px-5 py-2.5 text-sm font-medium border"
          style={{ borderColor: "var(--border)" }}
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
