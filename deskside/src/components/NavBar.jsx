import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <header
      className="border-b px-4 sm:px-6 py-3 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="flex items-center gap-6">
        <Link href="/devices" className="font-semibold tracking-tight">
          Deskside
        </Link>
        <nav className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/devices">Devices</Link>
          <Link href="/chat">Chat</Link>
        </nav>
      </div>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="text-sm rounded-lg px-3 py-1.5 border"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
