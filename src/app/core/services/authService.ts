import { API_BASE_URL, ENDPOINTS } from "../constants/endpoints";
import { Credentials, User } from "./types/auth";

const LOGIN_ENDPOINT = `${API_BASE_URL}${ENDPOINTS.LOGIN}`;
const LOGOUT_ENDPOINT = `${API_BASE_URL}${ENDPOINTS.LOGOUT}`;

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user against the backend endpoint
   */
  async login(credentials: Credentials): Promise<User> {
    console.log("Logging in with credentials:", credentials);
    const response = await fetch(LOGIN_ENDPOINT, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Login request failed with status ${response.status}`);
    }

    const user = (await response.json()) as User;
    return user;
  },

  /**
   * Logout user against the backend endpoint
   */
  async logout(): Promise<void> {
    const response = await fetch(LOGOUT_ENDPOINT, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Logout request failed with status ${response.status}`);
    }

    localStorage.removeItem("auth-token");
    localStorage.removeItem("current-user");
  },

  /**
   * Check if user is authenticated (mock)
   */
  isAuthenticated(): boolean {
    return localStorage.getItem("auth-token") !== null;
  },

  /**
   * Get current user from storage (mock)
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem("current-user");
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Store user data (mock)
   */
  storeUser(user: User): void {
    localStorage.setItem("current-user", JSON.stringify(user));
    localStorage.setItem("auth-token", "mock-token");
  },
};
