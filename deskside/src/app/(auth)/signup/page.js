import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Sign up — Deskside" };

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <AuthForm mode="signup" />
    </main>
  );
}
