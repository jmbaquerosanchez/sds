import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { Credentials, User } from "../services/types/auth";

/**
 * Authentication provider with full state management
 */
export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize user from storage on mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.login(credentials);
      authService.storeUser(user);
      setUser(user);
    } catch (err) {
      setError(err as Error);
      throw err; // Re-throw so components can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      //TODO: Implement logout
      setUser(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      login,
      logout,
      clearError,
      isHydrated,
    }),
    [user, isLoading, error, login, logout, clearError, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
