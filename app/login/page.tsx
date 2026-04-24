import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Sign In — ToastyBudget" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🍞 ToastyBudget</h1>
          <p className="text-sm text-gray-500 mt-1">Your CFO-style household tracker</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
