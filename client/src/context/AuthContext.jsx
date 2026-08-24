import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("bd_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore corrupt state */ }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((token, userData) => {
    localStorage.setItem("bd_token", token);
    localStorage.setItem("bd_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const demoLogin = useCallback(async (role) => {
    const { data } = await api.post("/auth/demo-login", { role });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem("bd_token");
    localStorage.removeItem("bd_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
