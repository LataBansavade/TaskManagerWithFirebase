import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticating: boolean;
  loading: boolean;
  signup: (credential: { email: string; password: string; name?: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);