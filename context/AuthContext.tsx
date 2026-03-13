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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);

  const supabase = createClient();

  // Fetch resumes from Supabase via server API (source of truth)
  async function fetchResumes(uid: string) {
    try {
      const res = await fetch(`/api/resumes?user_id=${uid}`);
      if (!res.ok) return;
      const data = await res.json();
      const resumes: SavedResume[] = data.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        title: row.title as string,
        templateId: row.template_id as TemplateId,
        resume: row.resume_data as GeneratedResume,
        savedAt: row.saved_at as string,
      }));
      resumes.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      setSavedResumes(resumes);
    } catch (e) {
      console.error("fetchResumes error:", e);
    }
  }

  useEffect(() => {
    let handled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const email = session.user.email!;
        const uid = session.user.id;

        // Only run setup once per mount (INITIAL_SESSION)
        if (handled) return;
        handled = true;

        setUserId(uid);
        setInitialized(true);

        // Set user with cached name first
        const cachedPaid = localStorage.getItem(`has_paid_${email}`) === "true";
        setUser({ name: "", email, hasPaid: cachedPaid });

        // Fetch profile and resumes in parallel
        const profilePromise = (async () => {
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
        })();

        await Promise.all([profilePromise, fetchResumes(uid)]);
      } else {
        handled = false;
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
      await fetchResumes(data.user.id);
    }
    return null;
  };

  const logout = async () => {
    setUser(null);
    setUserId(null);
    setSavedResumes([]);

    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) localStorage.removeItem(key);
      });
    } catch { /* ignore */ }

    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }

    window.location.href = "/";
  };

  const saveResume = async (resume: GeneratedResume, templateId: TemplateId) => {
    if (!user) return;

    let uid = userId;
    if (!uid) {
      const { data: { session } } = await supabase.auth.getSession();
      uid = session?.user?.id ?? null;
    }
    if (!uid) return;

    const title = resume.personalInfo?.fullName
      ? `${resume.personalInfo.fullName} — ${resume.personalInfo.jobTitle || "Resume"}`
      : "My Resume";

    const newEntry: SavedResume = {
      id: crypto.randomUUID(),
      title,
      templateId,
      resume,
      savedAt: new Date().toISOString(),
    };

    // Optimistic update
    setSavedResumes(prev => [newEntry, ...prev]);

    // Save to Supabase
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
        console.error("Save failed:", res.status, await res.text());
      }
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const deleteResume = async (id: string) => {
    setSavedResumes(prev => prev.filter(r => r.id !== id));

    // Delete from Supabase via API route
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
      if (!res.ok) console.warn("Delete failed:", res.status);
    } catch (e) {
      console.warn("Delete error:", e);
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
    if (!userId) return;
    await fetchResumes(userId);
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
