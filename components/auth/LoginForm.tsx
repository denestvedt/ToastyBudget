"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email to confirm your account.");
      }
    }

    setLoading(false);
  }

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-input)",
    color: "var(--text)",
    fontSize: 13,
    padding: "9px 12px",
    outline: "none",
    width: "100%",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-semibold"
          style={{ fontSize: 12, color: "var(--text-dim)" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-semibold"
          style={{ fontSize: 12, color: "var(--text-dim)" }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "var(--bad)" }}>{error}</p>
      )}
      {message && (
        <p style={{ fontSize: 12, color: "var(--good)" }}>{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-button transition-colors"
        style={{
          background: "var(--accent)",
          color: "var(--bg)",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          padding: "10px 16px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
      </button>

      <p className="text-center" style={{ fontSize: 12, color: "var(--text-dim)" }}>
        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="font-semibold"
          style={{
            color: "var(--accent)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
