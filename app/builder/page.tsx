"use client";
import { useState, useEffect, Suspense } from "react";
import { Loader2, Download, CheckCircle, ArrowLeft, FileText, Palette, Sparkles, Monitor } from "lucide-react";
import Link from "next/link";
import ResumeForm from "../../components/ResumeForm";
import ResumePreview from "../../components/ResumePreview";
import TemplatePicker from "../../components/TemplatePicker";
import type { TemplateId } from "../../components/TemplatePicker";
import { ResumeFormData, GeneratedResume } from "../../types/resume";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../../components/AuthModal";
import UserMenu from "../../components/UserMenu";
import { useRef } from "react";
import { printResume } from "../../lib/printResume";

const loadingMessages = [
  "Analyzing your experience...",
  "Crafting compelling bullet points...",
  "Optimizing for ATS systems...",
  "Polishing your summary...",
  "Finalizing your resume...",
];

function BuilderContent() {
  const { user, initialized, saveResume } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [step, setStep] = useState<"form" | "loading" | "template" | "preview">("form");
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);
  const [showDesktopHint, setShowDesktopHint] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const savedRef = useRef(false);

  // Show mobile warning on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setShowMobileWarning(true);
    }
  }, []);

  // Load Razorpay checkout script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayAndDownload = async () => {
    try {
      const res = await fetch("/api/create-razorpay-order", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create order");
      const { orderId } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 9900,
        currency: "INR",
        name: "ResumeAI",
        description: "Resume PDF Download",
        order_id: orderId,
        prefill: { name: user?.name ?? "", email: user?.email ?? "" },
        theme: { color: "#f97316" },
        method: { upi: true, netbanking: true, card: true, wallet: false },
        handler: () => {
          setPaymentDone(true);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setError("Payment failed — please try again.");
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadWarning(true);
  };

  const handleConfirmDownload = () => {
    setShowDownloadWarning(false);
    handlePayAndDownload();
  };

  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMsg(i => (i + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [step]);

  // Trigger print after payment completes
  useEffect(() => {
    if (paymentDone) {
      setPaymentDone(false);
      printResume();
    }
  }, [paymentDone]);

  // Show desktop hint on mobile when reaching preview step
  useEffect(() => {
    if (step === "preview" && typeof window !== "undefined" && window.innerWidth < 640) {
      setShowDesktopHint(true);
    }
  }, [step]);

  // Auto-save to profile when user reaches preview step (once per generation)
  useEffect(() => {
    if (step === "preview" && user && generatedResume && !savedRef.current) {
      savedRef.current = true;
      saveResume(generatedResume, selectedTemplate);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
    if (step !== "preview") savedRef.current = false;
  }, [step, user, generatedResume, selectedTemplate, saveResume]);

  const handleFormSubmit = async (data: ResumeFormData) => {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Generation failed — please try again.");
      }
      const resume: GeneratedResume = await res.json();
      setGeneratedResume(resume);
      setStep("template");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("form");
    }
  };

  // Step indicator
  const steps = [
    { id: "form", label: "Your Info" },
    { id: "template", label: "Template" },
    { id: "preview", label: "Download" },
  ];
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div id="builder-shell" className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
            <span className="font-bold text-stone-800 text-xs sm:text-sm tracking-tight">ResumeAI</span>
          </Link>

          {/* Step breadcrumb */}
          {step !== "loading" && (
            <div className="hidden sm:flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    i < currentStepIndex ? "bg-emerald-100 text-emerald-700" :
                    i === currentStepIndex ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm" :
                    "bg-stone-100 text-stone-400"
                  }`}>
                    {i < currentStepIndex ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
                    {s.label}
                  </div>
                  {i < steps.length - 1 && <div className={`w-4 h-px ${i < currentStepIndex ? "bg-emerald-300" : "bg-stone-200"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {(step === "template" || step === "preview") && (
              <button
                onClick={() => setStep(step === "template" ? "form" : "template")}
                className="mr-1 flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {step === "template" ? "Edit info" : "Templates"}
              </button>
            )}
            {!initialized ? (
              <div className="w-20 h-7 rounded-lg bg-stone-100 animate-pulse hidden sm:block" />
            ) : user ? (
              <UserMenu />
            ) : (
              <>
                <button
                  onClick={() => setAuthModal("login")}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors hidden sm:block"
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="text-xs bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-orange-200"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm animate-slide-up">{error}</div>
        )}
        {savedToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg animate-fade-in">
            <CheckCircle className="w-4 h-4" /> Resume saved to your profile!
          </div>
        )}

        {/* Download warning modal */}
        {showDownloadWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">One-Time Download</h3>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-2">
                Each PDF download requires a payment of <span className="font-bold text-orange-600">₹99</span>.
              </p>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Please note: The PDF can only be downloaded <span className="font-semibold text-stone-700">once per payment</span>. If you need to download the same resume again — including from your saved resumes — you will need to pay again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDownloadWarning(false)}
                  className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDownload}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-200"
                >
                  Pay ₹99 & Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile warning — always build on desktop */}
        {showMobileWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Use a Desktop Device</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Please build your resume on a <span className="font-semibold text-stone-700">desktop or laptop</span>. Payment and PDF download are only available on desktop. Make sure to use the <span className="font-semibold text-stone-700">same device and browser</span> throughout so your saved resumes stay accessible.
              </p>
              <button
                onClick={() => setShowMobileWarning(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-200"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Desktop hint modal (mobile only) */}
        {showDesktopHint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Use a Desktop Device</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                PDF downloads are only available on a <span className="font-semibold text-stone-700">desktop or laptop</span>. Please open this page on a computer to pay and download your resume.
              </p>
              <button
                onClick={() => setShowDesktopHint(false)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-200"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-xl shadow-orange-200">
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-2 tracking-tight">Building your resume…</h2>
            <p className="text-orange-600 font-semibold text-sm mb-1">{loadingMessages[loadingMsg]}</p>
            <p className="text-stone-400 text-xs">This takes about 15–20 seconds</p>
            <div className="flex gap-1.5 mt-8">
              {loadingMessages.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === loadingMsg ? "w-6 bg-gradient-to-r from-orange-500 to-rose-500" : "w-1.5 bg-stone-200"}`} />
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Build Your Resume</h1>
              <p className="text-stone-500 text-sm mt-1">Fill in your details — AI handles the writing</p>
            </div>
            <div className="rounded-2xl border border-stone-200/60 bg-white shadow-sm p-4 sm:p-8">
              <ResumeForm
              onSubmit={handleFormSubmit}
              isLoading={false}
              draftKey={user ? `resumeai_form_draft_${user.email}` : undefined}
            />
            </div>
          </div>
        )}

        {/* Template picker */}
        {step === "template" && generatedResume && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md shadow-violet-200">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">Choose Your Template</h1>
                  <p className="text-stone-400 text-xs mt-0.5">Pick a style — switch anytime before downloading</p>
                </div>
              </div>
              <button
                onClick={() => setStep("preview")}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-orange-200"
              >
                Continue →
              </button>
            </div>
            <div className="rounded-2xl border border-stone-200/60 bg-white shadow-sm p-6 sm:p-8">
              <TemplatePicker resume={generatedResume} selected={selectedTemplate} onSelect={setSelectedTemplate} />
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setStep("preview")}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-200"
              >
                Continue to Download →
              </button>
            </div>
          </div>
        )}

        {/* Preview & download */}
        {step === "preview" && generatedResume && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Your Resume is Ready!</h1>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">Click Download PDF to save your resume.</p>
              </div>
              <button
                onClick={handleDownloadClick}
                className="shrink-0 hidden sm:flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-200"
              >
                <Download className="w-4 h-4" /> Pay ₹99 & Download PDF
              </button>
            </div>

            <ResumePreview resume={generatedResume} templateId={selectedTemplate} />

            <div className="mt-6 hidden sm:flex justify-center">
              <button
                onClick={handleDownloadClick}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200"
              >
                <Download className="w-4 h-4" /> Pay ₹99 & Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto border-t border-stone-200/60 bg-white py-4 text-center">
        <p className="text-xs text-stone-400">
          For your saved resumes to appear in your account, please use the same browser you originally used to create them.
        </p>
      </footer>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
