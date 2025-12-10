import { create } from "zustand";
import { login } from "@/services/authService";

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;

  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  role: null,
  loading: false,
  error: null,

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      set({
        token: data.token,
        username: data.username,
        role: data.role,
        loading: false,
      });
    } catch (err: any) {
      console.error("Login failed:", err);
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    set({ token: null, username: null, role: null });
  },

}));
