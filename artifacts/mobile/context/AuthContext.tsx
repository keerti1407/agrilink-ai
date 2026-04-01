import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MOCK_USERS, User, UserRole } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "agrilink_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((data) => {
      if (data) {
        try {
          setUser(JSON.parse(data));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found));
      setUser(found);
      return { success: true };
    }
    const demoUser: User = {
      id: `u_${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: email.includes("buyer") ? "buyer" : email.includes("admin") ? "admin" : "farmer",
      location: "India",
      verified: false,
      joinDate: new Date().toISOString().split("T")[0],
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role,
      location: "India",
      verified: false,
      joinDate: new Date().toISOString().split("T")[0],
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
