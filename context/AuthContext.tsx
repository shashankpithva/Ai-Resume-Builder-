"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "../lib/supabase";
import { GeneratedResume } from "../types/resume";
import type { TemplateId } from "../components/TemplatePicker";

export interface User {
  name: string;
  email: string;
  hasPaid?: boolean;
}

export interface SavedResume {
  id: string;
  title: string;
  templateId: TemplateId;
  resume: GeneratedResume;
  savedAt: string;
}

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  savedResumes: SavedResume[];
  saveResume: (resume: GeneratedResume, templateId: TemplateId) => void;
  deleteResume: (id: string) => void;
  refreshResumes: () => Promise<void>;
  markAsPaid: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsKey(email: string) {
  return `saved_resumes_${email}`;
}
function lsLoad(email: string): SavedResume[] {
  try {
    const raw = localStorage.getItem(lsKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function lsSave(email: string, resumes: SavedResume[]) {
  try {
    localStorage.setItem(lsKey(email), JSON.stringify(resumes));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);

  const supabase = createClient();

  // Load resumes from Supabase (source of truth), merge with localStorage
  async function loadResumes(userId: string, email: string) {
    try {
      const res = await fetch(`/api/resumes?user_id=${userId}`);

      if (!res.ok) {
        const body = await res.text();
        console.error("Resumes fetch error:", res.status, body);
        return;
      }

      const data = await res.json();
      const remote: SavedResume[] = data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        templateId: row.template_id as TemplateId,
        resume: row.resume_data as GeneratedResume,
        savedAt: row.saved_at as string,
      }));

      // Merge remote (Supabase) with localStorage, then set as state
      const local = lsLoad(email);
      const merged = mergeResumes(local, remote, email);
      setSavedResumes(merged);
    } catch (e) {
      console.error("loadResumes exception:", e);
    }
  }

  // Merge two resume arrays: deduplicate by id, exclude deleted, sort newest first
  function mergeResumes(current: SavedResume[], incoming: SavedResume[], email: string): SavedResume[] {
    let deletedIds: Set<string> = new Set();
    try {
      const raw = localStorage.getItem(`deleted_resumes_${email}`);
      deletedIds = new Set(raw ? JSON.parse(raw) : []);
    } catch { /* ignore */ }

    const map = new Map<string, SavedResume>();
    [...current, ...incoming].forEach(r => {
      if (!deletedIds.has(r.id)) map.set(r.id, r);
    });
    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
    lsSave(email, merged);
    return merged;
  }

  useEffect(() => {
    let currentUid: string | null = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email!;
        const uid = session.user.id;

        // Skip duplicate events for the same user (e.g. TOKEN_REFRESHED after INITIAL_SESSION)
        if (currentUid === uid && event !== "SIGNED_IN") return;
        currentUid = uid;

        // Show localStorage resumes + cached hasPaid instantly
        const cachedPaid = localStorage.getItem(`has_paid_${email}`) === "true";
        setSavedResumes(lsLoad(email));
        setUser({ name: "", email, hasPaid: cachedPaid });
        setUserId(uid);
        setInitialized(true);

        // Fetch profile name + has_paid in background
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, has_paid")
            .eq("id", uid)
            .single();
          const paid = profile?.has_paid ?? false;
          if (paid) localStorage.setItem(`has_paid_${email}`, "true");
          setUser({ name: profile?.name ?? "", email, hasPaid: paid });
        } catch { /* ignore */ }

        // Always load from Supabase — this is the cross-browser source of truth
        loadResumes(uid, email);
      } else {
        currentUid = null;
        setUser(null);
        setUserId(null);
        setSavedResumes([]);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({ id: data.user.id, name });
      if (profileError) console.warn("Profile insert failed:", profileError.message);
      setUser({ name, email });
      setSavedResumes([]);
    }
    return null;
  };

  const login = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) {
      setUserId(data.user.id);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, has_paid")
          .eq("id", data.user.id)
          .single();
        setUser({ name: profile?.name ?? "", email: data.user.email!, hasPaid: profile?.has_paid ?? false });
      } catch {
        setUser({ name: "", email: data.user.email!, hasPaid: false });
      }
      await loadResumes(data.user.id, data.user.email!);
    }
    return null;
  };

  const logout = async () => {
    // Clear UI state immediately — do not wait for Supabase
    setUser(null);
    setUserId(null);
    setSavedResumes([]);

    // Clear all Supabase auth tokens from localStorage
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) localStorage.removeItem(key);
      });
    } catch { /* ignore */ }

    // Tell Supabase to sign out (best-effort)
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }

    // Hard reload to fully reset all in-memory state
    window.location.href = "/";
  };

  const saveResume = async (resume: GeneratedResume, templateId: TemplateId) => {
    if (!user) { console.warn("saveResume: no user"); return; }

    // Get userId from state, fall back to live session if state not ready yet
    let uid = userId;
    if (!uid) {
      console.warn("saveResume: userId not in state, fetching from session");
      const { data: { session } } = await supabase.auth.getSession();
      uid = session?.user?.id ?? null;
    }
    if (!uid) { console.warn("saveResume: no userId available, skipping Supabase insert"); return; }

    const title = resume.personalInfo?.fullName
      ? `${resume.personalInfo.fullName} — ${resume.personalInfo.jobTitle || "Resume"}`
      : "My Resume";

    const newEntry: SavedResume = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      templateId,
      resume,
      savedAt: new Date().toISOString(),
    };

    // Save to localStorage immediately
    const updated = [newEntry, ...savedResumes];
    setSavedResumes(updated);
    lsSave(user.email, updated);

    // Save to Supabase via API route (uses service role, bypasses RLS)
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newEntry.id,
          user_id: uid,
          title,
          template_id: templateId,
          resume_data: resume,
          saved_at: newEntry.savedAt,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Supabase insert failed:", res.status, body);
      }
    } catch (e) {
      console.error("Supabase insert exception:", e);
    }
  };

  const deleteResume = async (id: string) => {
    const updated = savedResumes.filter((r) => r.id !== id);
    setSavedResumes(updated);
    if (user) {
      lsSave(user.email, updated);
      // Track deleted ids so mergeResumes never re-adds them from Supabase
      const deletedKey = `deleted_resumes_${user.email}`;
      try {
        const existing: string[] = JSON.parse(localStorage.getItem(deletedKey) || "[]");
        localStorage.setItem(deletedKey, JSON.stringify([...new Set([...existing, id])]));
      } catch { /* ignore */ }
    }

    try {
      const { error } = await supabase.from("saved_resumes").delete().eq("id", id);
      if (error) console.warn("Supabase delete failed:", error.message);
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }
  };

  const markAsPaid = async () => {
    if (!user || !userId) return;
    setUser(prev => prev ? { ...prev, hasPaid: true } : null);
    try { localStorage.setItem(`has_paid_${user.email}`, "true"); } catch { /* ignore */ }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ has_paid: true }),
        }
      );
    } catch (e) {
      console.error("markAsPaid error:", e);
    }
  };

  const refreshResumes = async () => {
    if (!user || !userId) return;
    await loadResumes(userId, user.email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialized,
        login,
        signup,
        logout,
        savedResumes,
        saveResume,
        deleteResume,
        refreshResumes,
        markAsPaid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
