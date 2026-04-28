import { createContext } from "react";
import { Credentials, User } from "../services/types/auth";

/**
 * Authentication context type
 */
export interface AuthContextType {
  /**
   * The current user. null if unauthenticated.
   */
  user: User | null;
  /**
   * Whether an authentication operation is in progress
   */
  isLoading: boolean;
  /**
   * Any authentication error
   */
  error: Error | null;
  /**
   * Method to log a user in
   */
  login: (credentials: Credentials) => Promise<void>;
  /**
   * Method to log a user out
   */
  logout: () => void;
  /**
   * Clear any authentication errors
   */
  clearError: () => void;
  /**
   * Indicates whether the persisted auth state has completed hydration
   */
  isHydrated: boolean;
}

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextType | null>(null);
