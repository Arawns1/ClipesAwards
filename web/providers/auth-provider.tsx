"use client";
import { env } from "@/env";
import { createContext, ReactNode } from "react";
type AuthProviderProps = {
  children: ReactNode;
};
type AuthContextType = {
  login: () => void;
  logout: () => void;
};
const LOGIN_URL = `${env.NEXT_PUBLIC_BASE_API_URL}/api/auth/login`;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const login = () => {
    window.location.href = LOGIN_URL;
  };

  const logout = async () => {
    try {
      await fetch(`${env.NEXT_PUBLIC_BASE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
