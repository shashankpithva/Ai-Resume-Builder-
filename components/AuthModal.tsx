"use client";
import { useState } from "react";
import { X, Loader2, FileText, MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export default function AuthModal({ onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let err: string | null = null;
    if (tab === "signup") {
      if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
      err = await signup(name.trim(), email.trim(), password);
    } else {
      err = await login(email.trim(), password);
    }
    setLoading(false);
    if (err) { setError(err); return; }
    if (tab === "signup") {
      setSignupSuccess(true);
      return;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 px-8 pt-8 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            {tab === "login" ? "Sign in to your ResumeAI account" : "Join ResumeAI for free"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === t
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Signup success — email verification notice */}
        {signupSuccess && (
          <div className="px-8 py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
              <MailCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-lg font-black text-stone-900">Check your email</h3>
            <p className="text-sm text-stone-500">
              We sent a confirmation link to <span className="font-semibold text-stone-700">{email}</span>. Click it to activate your account, then log in.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Got it
            </button>
          </div>
        )}

        {/* Form */}
        {!signupSuccess && <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {tab === "signup" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-stone-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-stone-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {tab === "login" ? "Log In" : "Create Account"}
          </button>

          <p className="text-center text-xs text-stone-400">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(null); }}
              className="text-orange-600 font-semibold hover:underline"
            >
              {tab === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </form>}
      </div>
    </div>
  );
}
