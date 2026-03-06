"use client";
import { useState } from "react";
import { LogOut, ChevronDown, User, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = (() => {
    const name = (user.name || "").trim();
    if (name) {
      return name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user.email) return user.email[0].toUpperCase();
    return "?";
  })();

  const displayName = (user.name || "").trim() || user.email;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-200"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: "linear-gradient(135deg, #f97316, #e11d48)" }}
        >
          {initials || <User className="w-3.5 h-3.5" />}
        </div>
        <span className="hidden sm:block max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Invisible backdrop — clicking outside closes the menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200/60 bg-white shadow-lg">
            <div className="border-b border-stone-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-stone-900">{displayName}</p>
              <p className="truncate text-xs text-stone-400">{user.email}</p>
            </div>

            <Link
              href="/builder"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
            >
              <FileText className="w-4 h-4 text-stone-400" />
              Builder
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
            >
              <User className="w-4 h-4 text-stone-400" />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full border-t border-stone-100 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
