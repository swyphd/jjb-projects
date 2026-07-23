import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DevicesClient from "@/components/devices/DevicesClient";

export const metadata = { title: "Your devices — Deskside" };

export default async function DevicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: devices } = await supabase
    .from("devices")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
      <DevicesClient initialDevices={devices ?? []} userId={user.id} />
    </main>
  );
}
