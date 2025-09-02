// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const Auth = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/auth/me"); // withCredentials already true in api.js
        setUser(data.user);
      } catch (err) {
        // ✅ 401 = not logged in; treat as guest, no console noise
        if (err?.response?.status !== 401) {
          console.warn("Auth /me failed:", err?.response?.status, err?.message);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    setUser(data.user ?? null);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post("/api/auth/login", payload);
    setUser(data.user ?? null);
    return data;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <Auth.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </Auth.Provider>
  );
}

export const useAuth = () => useContext(Auth);
