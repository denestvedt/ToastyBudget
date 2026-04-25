import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign In — ToastyBudget" };

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center rounded-[14px] mb-4 text-3xl"
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, var(--accent-2), var(--accent))",
            }}
          >
            🍞
          </div>
          <h1
            className="font-bold block"
            style={{ fontSize: "1.692rem", letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            ToastyBudget
          </h1>
          <p style={{ fontSize: "0.923rem", color: "var(--text-mute)", marginTop: 4 }}>
            Your household budget, under control
          </p>
        </div>

        <div
          className="rounded-card p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
