import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import type { User } from "@/lib/types";

interface Session {
  user: User;
  loggedInAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "pg_management_session";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);

    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession) as Session;
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const persistSession = (nextUser: User) => {
    const nextSession: Session = {
      user: nextUser,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setUser(nextUser);
  };

  const signIn = async (email: string, password: string) => {
    const response = await apiRequest<{ data: User }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    persistSession(response.data);
  };

  const signUp = async (email: string, password: string) => {
    const response = await apiRequest<{ data: User }>("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });

    persistSession(response.data);
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
