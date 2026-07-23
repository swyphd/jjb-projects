import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in — Deskside" };

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <AuthForm mode="login" />
    </main>
  );
}
