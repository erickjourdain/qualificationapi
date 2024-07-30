import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { AppAuthContext } from "@/types/appAuthContext";
import { User } from "@/gec-tripetto";
import { includes } from "lodash";

const AuthContext = createContext<AppAuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isLogged = !!user;
  const isAdmin = isLogged && user.role === "ADMIN";
  const isCreator = isLogged && includes(["ADMIN", "CREATOR"], user.role);
  const isUser = isLogged && includes(["ADMIN", "CREATOR", "USER"], user.role);

  const login = useCallback((user: User) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogged, isAdmin, isCreator, isUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

