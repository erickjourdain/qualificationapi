import { createContext, useContext } from "react";
import { useAtomValue } from "jotai";
import { adminAtom, creatorAtom } from "./stores/mainStore";

export interface AuthContext {
  isAdmin: boolean;
  isCreator: boolean;
}

const AuthContext = createContext<AuthContext | undefined>({ isAdmin: false, isCreator: false})

export function AuthProvider({ children }: { children: React.ReactNode }) {

  // Chargement de l'état du rôle de l'utilisateur
  const isAdmin = useAtomValue(adminAtom);
  const isCreator = useAtomValue(creatorAtom);

  return (
    <AuthContext.Provider value={{ isAdmin, isCreator }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
