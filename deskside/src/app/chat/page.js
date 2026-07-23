import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatClient from "@/components/chat/ChatClient";

export const metadata = { title: "Chat — Deskside" };

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 min-h-0">
      <ChatClient />
    </main>
  );
}
