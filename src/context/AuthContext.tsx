import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { demoUsers } from "../lib/demoData";
import type { User, Role } from "../types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName: string, role: Role) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
const KEY = "nuwafra_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      // 1) إذا Supabase متصل — نتحقق من الجلسة أولاً
      if (isSupabaseConfigured && supabase) {
        const client = supabase;
        const { data: sessionData } = await client.auth.getSession();
        if (sessionData?.session?.user) {
          const { data: profile } = await client
            .from("users")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();
          if (profile) {
            setUser(profile as User);
            localStorage.setItem(KEY, JSON.stringify(profile));
            setLoading(false);
            return;
          }
        }
      }

      // 2) إذا ما فيه جلسة Supabase — استخدم الـ localStorage
      const stored = localStorage.getItem(KEY);
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      }
      setLoading(false);
    };

    loadUser();

    // الاستماع لتغييرات تسجيل الدخول/الخروج من Supabase
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data: sub } = client.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem(KEY);
        } else if (session?.user) {
          const { data: profile } = await client
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profile) {
            setUser(profile as User);
            localStorage.setItem(KEY, JSON.stringify(profile));
          }
        }
      });
      return () => { sub.subscription.unsubscribe(); };
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login: AuthCtx["login"] = async (email, password) => {
    // 1) إذا Supabase متصل — استخدم Auth الحقيقي
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const { data: profile } = await client
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          persist(profile as User);
          return {};
        }
        return { error: "لم يتم العثور على ملف المستخدم" };
      }
      return { error: "فشل تسجيل الدخول" };
    }

    // 2) وضع Demo فقط إذا Supabase غير متصل
    if (email.endsWith("@nuwafra.demo") && password === "demo1234") {
      const found = demoUsers.find(u => u.email === email);
      if (found) { persist(found); return {}; }
    }
    return { error: "Supabase غير مُهيأ. استخدم حساب Demo." };
  };

  const register: AuthCtx["register"] = async (email, password, fullName, role) => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data, error } = await client.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, role } }
      });
      if (error) return { error: error.message };
      if (data.user) {
        // انتظر لحظة حتى ينشئ Trigger السجل
        await new Promise(r => setTimeout(r, 800));
        const { data: profile } = await client
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) persist(profile as User);
        return {};
      }
      return {};
    }

    // Demo fallback
    const newUser: User = { id: "u-" + Date.now(), email, full_name: fullName, role };
    persist(newUser);
    return {};
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    persist(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);