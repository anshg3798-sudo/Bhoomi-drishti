import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mountain, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 text-[var(--color-text)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-green-soft)] text-[var(--color-green)]">
            <Mountain className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-[var(--font-display)] text-lg font-semibold">Create your account</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Or use the demo account from the sign-in page</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">Full name</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">Email</label>
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">Password</label>
              <input type="password" required value={form.password} onChange={(e) => update("password", e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-faint)]">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {["farmer", "officer"].map((role) => (
                  <button
                    type="button" key={role} onClick={() => update("role", role)}
                    className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                      form.role === role ? "border-[var(--color-green)] bg-[var(--color-green-soft)] text-[var(--color-green)]" : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-xs text-[var(--color-red)]">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-green)] px-4 py-2.5 text-sm font-semibold text-[#fdfcf6] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-text-faint)]">
          Already have an account? <Link to="/login" className="font-medium text-[var(--color-green)]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}