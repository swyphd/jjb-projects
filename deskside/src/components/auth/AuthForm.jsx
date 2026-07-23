"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const { error: authError } = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/devices");
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="card p-8">
        <h1 className="text-xl font-semibold text-center mb-1">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "var(--muted)" }}>
          {isSignup
            ? "Log your gear and get grounded IT help."
            : "Sign in to Deskside."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: "var(--border)" }}
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />

          {error && (
            <p className="text-sm" style={{ color: "var(--verdict-not-fg)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: "var(--brand)" }}
          >
            {loading ? "Please wait…" : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            or
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-lg border py-2 text-sm font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6" style={{ color: "var(--muted)" }}>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium" style={{ color: "var(--brand)" }}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to Deskside?{" "}
              <Link href="/signup" className="font-medium" style={{ color: "var(--brand)" }}>
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
