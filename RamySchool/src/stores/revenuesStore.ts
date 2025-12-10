import { create } from "zustand";
import {
  fetchTotal,
  fetchNet,
  fetchTeacherRevenue,
  TotalResponse,
  NetResponse,
  TeacherFinanceResponse,
} from "@/services/revenuesService";

interface FinanceState {
  total: number | null;
  net: number | null;
  teacherRevenue: number | null;
  loading: boolean;
  error: string | null;

  getTotal: () => Promise<void>;
  getNet: () => Promise<void>;
  getTeacherRevenue: (teacherId: number) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  total: null,
  net: null,
  teacherRevenue: null,
  loading: false,
  error: null,

  // ✅ Get total revenue
  getTotal: async () => {
    set({ loading: true, error: null });
    try {
      const res: TotalResponse = await fetchTotal();
      set({ total: res.total, loading: false });
    } catch (err: any) {
      console.error("Error fetching total:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch total revenue",
        loading: false,
      });
    }
  },

  // ✅ Get net revenue
  getNet: async () => {
    set({ loading: true, error: null });
    try {
      const res: NetResponse = await fetchNet();
      set({ net: res.net, loading: false });
    } catch (err: any) {
      console.error("Error fetching net:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch net revenue",
        loading: false,
      });
    }
  },

  // ✅ Get teacher-specific revenue
  getTeacherRevenue: async (teacherId: number) => {
    set({ loading: true, error: null });
    try {
      const res: TeacherFinanceResponse = await fetchTeacherRevenue(teacherId);
      set({ teacherRevenue: res.revenue, loading: false });
    } catch (err: any) {
      console.error("Error fetching teacher revenue:", err);
      set({
        error:
          err.response?.data?.message ||
          `Failed to fetch revenue for teacher ${teacherId}`,
        loading: false,
      });
    }
  },
}));
