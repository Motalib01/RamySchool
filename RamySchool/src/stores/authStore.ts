import { create } from "zustand";
import { login } from "@/services/authService";

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;

  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,
  role: null,
  loading: false,
  error: null,

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      set({
        token: data.token,
        email: data.email,
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
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    set({ token: null, email: null, role: null });
  },

}));
