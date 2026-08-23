import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mountain, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo(role) {
    setError(null);
    setDemoLoading(role);
    try {
      await demoLogin(role);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not start demo session.");
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 text-[var(--color-text)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-green-soft)] text-[var(--color-green)]">
            <Mountain className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-[var(--font-display)] text-lg font-semibold">Sign in to Bhoomi-Drishti</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Geo-AI Soil Erosion Monitoring Platform</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="space-y-2">
            <button
              onClick={() => handleDemo("farmer")}
              disabled={demoLoading !== null}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-green)] px-4 py-2.5 text-sm font-semibold text-[#fdfcf6] disabled:opacity-60"
            >
              {demoLoading === "farmer" && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue with Demo Account (Farmer)
            </button>
            <button
              onClick={() => handleDemo("officer")}
              disabled={demoLoading !== null}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--color-green)]/40 disabled:opacity-60"
            >
              {demoLoading === "officer" && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue with Demo Account (Officer)
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border-soft)]" />
            <span className="text-[11px] text-[var(--color-text-faint)]">or sign in</span>
            <div className="h-px flex-1 bg-[var(--color-border-soft)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40"
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              />
            </div>
            {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold hover:border-[var(--color-green)]/40 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-text-faint)]">
          Don't have an account? <Link to="/register" className="font-medium text-[var(--color-green)]">Register</Link>
        </p>
      </div>
    </div>
  );
}