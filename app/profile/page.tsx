"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Trash2, Eye, Download, ArrowLeft, User, Clock, Plus } from "lucide-react";
import { printResume } from "../../lib/printResume";
import { useAuth, SavedResume } from "../../context/AuthContext";
import AuthModal from "../../components/AuthModal";
import UserMenu from "../../components/UserMenu";
import ResumePreview from "../../components/ResumePreview";
import type { TemplateId } from "../../components/TemplatePicker";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function ProfilePage() {
  const { user, initialized, savedResumes, deleteResume, refreshResumes } = useAuth();
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [viewing, setViewing] = useState<SavedResume | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [showDownloadWarning, setShowDownloadWarning] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Trigger print after payment completes
  useEffect(() => {
    if (paymentDone) {
      setPaymentDone(false);
      printResume();
    }
  }, [paymentDone]);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayAndDownload = async () => {
    setPayError(null);
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
      setPayError("Payment failed — please try again.");
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadWarning(true);
  };

  const handleConfirmDownload = () => {
    setShowDownloadWarning(false);
    handlePayAndDownload();
  };

  // Context already loads resumes on auth — no need to re-fetch on every mount

  // Not logged in state
  if (initialized && !user) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
        {authModal && <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-stone-800 text-sm tracking-tight">ResumeAI</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={() => setAuthModal("login")} className="text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors">Log In</button>
              <button onClick={() => setAuthModal("signup")} className="text-xs bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-orange-200">Sign Up</button>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 flex items-center justify-center mx-auto mb-5">
              <User className="w-7 h-7 text-orange-500" />
            </div>
            <h1 className="text-2xl font-black text-stone-900 mb-2">Your Profile</h1>
            <p className="text-stone-500 text-sm mb-6">Log in or sign up to view and manage your saved resumes.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setAuthModal("login")} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors">Log In</button>
              <button onClick={() => setAuthModal("signup")} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-200">Sign Up Free</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen resume viewer
  if (viewing) {
    return (
      <div className="min-h-screen bg-stone-100">
        <div className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-auto sm:h-14 py-3 sm:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start">
              <button
                onClick={() => setViewing(null)}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs sm:text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back
              </button>
              <span className="font-semibold text-stone-700 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-xs sm:ml-4">{viewing.title}</span>
            </div>
            <button
              onClick={handleDownloadClick}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-orange-200 w-full sm:w-auto"
            >
              <Download className="w-3.5 h-3.5" /> Pay ₹99 & Download PDF
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <ResumePreview resume={viewing.resume} templateId={viewing.templateId as TemplateId} />
        </div>

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

        {payError && (
          <div className="fixed bottom-6 right-6 z-50 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm shadow-lg">
            {payError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-200">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
            <span className="font-bold text-stone-800 text-xs sm:text-sm tracking-tight">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/builder" className="text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors hidden sm:block">
              + New Resume
            </Link>
            {!initialized ? (
            <div className="w-20 h-7 rounded-lg bg-stone-100 animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : null}
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-200 text-white text-base sm:text-xl font-black">
              {(() => {
                const name = (user?.name || "").trim();
                if (name) return name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
                if (user?.email) return user.email[0].toUpperCase();
                return "?";
              })()}
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">{user?.name}</h1>
              <p className="text-stone-400 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/builder"
            className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-200 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> New Resume
          </Link>
        </div>

        {/* Saved resumes */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-lg font-black text-stone-900">Saved Resumes</h2>
            <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {savedResumes.length}
            </span>
          </div>

          {savedResumes.length === 0 ? (
            <div className="rounded-2xl border border-stone-200/60 bg-white shadow-sm p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-stone-300" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">No saved resumes yet</h3>
              <p className="text-stone-400 text-sm mb-6">Build your first resume and it'll appear here automatically.</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-200"
              >
                <Plus className="w-4 h-4" /> Build a Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResumes.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-stone-200/60 bg-white shadow-sm transition-all overflow-hidden group hover:shadow-md card-hover flex flex-col"
                >
                  {/* Card top — mini preview strip */}
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-rose-500" />

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-900 text-sm leading-tight truncate">{r.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs capitalize text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                            {r.templateId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-stone-400 text-xs mb-5">
                      <Clock className="w-3 h-3" />
                      {formatDate(r.savedAt)}
                    </div>

                    {/* Info snippets */}
                    {r.resume.personalInfo && (
                      <div className="text-xs text-stone-500 space-y-0.5 mb-5">
                        {r.resume.personalInfo.jobTitle && (
                          <p className="truncate">{r.resume.personalInfo.jobTitle}</p>
                        )}
                        {r.resume.personalInfo.email && (
                          <p className="truncate text-stone-400">{r.resume.personalInfo.email}</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setViewing(r)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold py-2 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {deleteConfirm === r.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => { deleteResume(r.id); setDeleteConfirm(null); }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(r.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto border-t border-stone-200/60 bg-white py-4 text-center">
        <p className="text-xs text-stone-400">
          Your saved resumes sync across all your devices.
        </p>
      </footer>
    </div>
  );
}
