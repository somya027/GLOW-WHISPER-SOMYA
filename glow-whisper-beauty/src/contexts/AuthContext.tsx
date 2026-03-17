import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authApi,
  setTokens,
  clearTokens,
  isAuthenticated as isAuth,
} from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, mobile?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!isAuth()) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.me();
      setUser(res.data as User);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const d = res.data as { access_token: string; refresh_token: string; user: User };
    setTokens(d.access_token, d.refresh_token);
    setUser(d.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, mobile?: string) => {
      const res = await authApi.register(name, email, password, mobile);
      const d = res.data as { access_token: string; refresh_token: string; user: User };
      setTokens(d.access_token, d.refresh_token);
      setUser(d.user);
    },
    [],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
