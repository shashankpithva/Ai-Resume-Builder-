"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Rocket, Sparkles, UserCircle2, Zap, Shield, Clock, ChevronRight, ArrowRight, Star, Layout } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import UserMenu from "../components/UserMenu";

export default function LandingPage() {
  const { user, initialized } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {authModal && <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />}

      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-stone-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-stone-800">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/builder" className="hidden rounded-lg bg-stone-800 hover:bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors sm:block">
              Open Builder
            </Link>
            {!initialized ? (
              <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-stone-200 sm:block" />
            ) : user ? (
              <UserMenu />
            ) : (
              <>
                <button onClick={() => setAuthModal("login")} className="hidden text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors sm:block">
                  Log In
                </button>
                <button onClick={() => setAuthModal("signup")} className="rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pb-16 sm:pb-24 pt-28 sm:pt-36 hero-glow">
        {/* Decorative elements */}
        <div className="absolute top-16 left-8 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10 animate-float hidden sm:block" />
        <div className="absolute bottom-0 right-8 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl -z-10 animate-float-delayed hidden sm:block" />
        <div className="absolute top-40 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-40 hidden sm:block" />
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-rose-400 rounded-full opacity-30 hidden sm:block" />
        <div className="absolute bottom-32 right-1/3 w-2.5 h-2.5 bg-amber-400 rounded-full opacity-35 hidden sm:block" />

        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-orange-700 shadow-sm">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> AI-Powered Resume Builder
          </p>
          <h1 className="mb-5 sm:mb-6 text-3xl sm:text-5xl font-black leading-[1.15] tracking-tight lg:text-7xl">
            Build a job-winning
            <br />
            <span className="gradient-text">resume in minutes</span>
          </h1>
          <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-base sm:text-lg text-stone-500 leading-relaxed px-2">
            Add your experience once. ResumeAI generates polished, ATS-friendly bullet points and a professional resume — ready to download.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row px-2">
            <Link href="/builder" className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-7 sm:px-9 py-3.5 sm:py-4.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-200/50 transition-all hover:shadow-2xl hover:shadow-orange-300/50">
              Start Building Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/profile" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 px-7 sm:px-9 py-3.5 sm:py-4.5 text-sm sm:text-base font-semibold text-stone-700 transition-colors shadow-sm">
              View Saved Resumes <UserCircle2 className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-5 sm:mt-6 text-xs text-stone-400">No credit card required to get started</p>
        </div>
      </section>

      {/* Trusted strip */}
      <section className="border-y border-stone-200/60 bg-white px-4 sm:px-6 py-5 sm:py-6">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-12 text-stone-400">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-xs sm:text-sm font-semibold text-stone-500">Loved by job seekers</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-stone-200" />
          <span className="text-xs sm:text-sm font-medium">14+ Professional Templates</span>
          <div className="hidden sm:block w-px h-5 bg-stone-200" />
          <span className="text-xs sm:text-sm font-medium">ATS-Friendly Formats</span>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white grid-bg relative">
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-widest mb-2 sm:mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight lg:text-5xl text-stone-800">Three steps to your<br className="hidden sm:block" /> perfect resume</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                step: "01",
                title: "Enter your details",
                desc: "Fill in your experience, skills, and education. No formatting needed — just the raw facts.",
                gradient: "from-orange-500 to-amber-500",
                shadow: "shadow-orange-200",
              },
              {
                step: "02",
                title: "AI writes it for you",
                desc: "Our AI crafts compelling bullet points, a strong summary, and ATS-optimized content instantly.",
                gradient: "from-rose-500 to-pink-500",
                shadow: "shadow-rose-200",
              },
              {
                step: "03",
                title: "Pick a template & download",
                desc: "Choose from 14+ stunning professional templates and download your polished PDF.",
                gradient: "from-violet-500 to-purple-500",
                shadow: "shadow-violet-200",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl sm:rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 card-hover shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-sm font-black mb-5 shadow-lg ${item.shadow}`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-stone-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-widest mb-2 sm:mb-3">Why ResumeAI</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight lg:text-5xl text-stone-800">Everything you need<br className="hidden sm:block" /> to land the job</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "AI-Written Content",
                desc: "Professional bullet points and summaries generated from your experience.",
                bg: "bg-gradient-to-br from-orange-50 to-amber-50",
                iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
                border: "border-orange-100",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "ATS-Optimized",
                desc: "Passes applicant tracking systems so your resume actually gets seen by recruiters.",
                bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
                border: "border-emerald-100",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Ready in Minutes",
                desc: "No more hours of formatting. Get a polished resume in under 2 minutes.",
                bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
                iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
                border: "border-amber-100",
              },
              {
                icon: <Layout className="w-5 h-5" />,
                title: "14+ Templates",
                desc: "Professional designs from classic to modern — pick the one that fits your style.",
                bg: "bg-gradient-to-br from-violet-50 to-purple-50",
                iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
                border: "border-violet-100",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: "Save & Reuse",
                desc: "Your resumes are saved to your profile. Come back and download anytime.",
                bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
                iconBg: "bg-gradient-to-br from-sky-500 to-cyan-500",
                border: "border-sky-100",
              },
              {
                icon: <Rocket className="w-5 h-5" />,
                title: "Instant PDF Export",
                desc: "Download a print-ready PDF that looks great on screen and on paper.",
                bg: "bg-gradient-to-br from-rose-50 to-pink-50",
                iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
                border: "border-rose-100",
              },
            ].map((f) => (
              <div key={f.title} className={`rounded-2xl sm:rounded-3xl border ${f.border} ${f.bg} p-4 sm:p-7 card-hover`}>
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${f.iconBg} flex items-center justify-center text-white mb-3 sm:mb-5 shadow-md`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-stone-800 text-sm sm:text-lg mb-1 sm:mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-6 py-12 sm:px-16 sm:py-16 shadow-2xl">
            {/* Decorative glow inside CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight lg:text-5xl mb-4 sm:mb-5">
                Ready to build your<br />resume?
              </h2>
              <p className="text-stone-400 text-sm sm:text-base mb-7 sm:mb-9 max-w-lg mx-auto leading-relaxed">
                Join thousands of job seekers who landed interviews with an AI-powered resume. It only takes a few minutes.
              </p>
              <Link
                href="/builder"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-7 sm:px-9 py-3.5 sm:py-4.5 text-sm sm:text-base font-bold text-white transition-all shadow-xl shadow-orange-500/20"
              >
                Get Started Now <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-stone-200/60 bg-white py-6 text-center">
        <p className="text-xs text-stone-400">
          Your saved resumes sync across all your devices.
        </p>
        <p className="text-xs text-stone-300 mt-2">&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
