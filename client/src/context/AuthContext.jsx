// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const Auth = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current session on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/api/auth/me"); // requires cookie
        if (!ignore) setUser(data.user);
      } catch (e) {
        // 401 is expected when not logged in yet
        if (e?.response?.status !== 401) {
          console.warn("Auth /me failed:", e);
        }
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Register: do NOT set user; email verification is required
  const register = async (payload) => {
    try {
      const { data } = await api.post("/api/auth/register", payload);
      // server returns { message: "Registered. Check your email..." }
      return data;
    } catch (e) {
      throw e;
    }
  };

  const login = async (payload) => {
    try {
      const { data } = await api.post("/api/auth/login", payload);
      setUser(data.user ?? null);
      return data;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <Auth.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </Auth.Provider>
  );
}

export const useAuth = () => useContext(Auth);
