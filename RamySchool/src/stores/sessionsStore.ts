import { create } from "zustand";
import SessionService, {
  SessionRequest,
  SessionResponse,
} from "@/services/sessionsService";
import { AttendanceResponse } from "@/services/sessionsService";

interface SessionState {
  sessions: SessionResponse[];
  selectedSession: SessionResponse | null;
  loading: boolean;
  error: string | null;

  fetchSessions: () => Promise<void>;
  fetchSessionById: (id: number) => Promise<void>;
  addSession: (data: SessionRequest) => Promise<void>;
  updateSession: (id: number, data: SessionRequest) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;

  getStudentSessions: (studentId: number) => Promise<AttendanceResponse[]>;
  updateAttendanceState: (
    attendanceId: number,
    isPresent: number
  ) => Promise<string>;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await SessionService.getAll();
      set({ sessions });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch sessions" });
    } finally {
      set({ loading: false });
    }
  },

  fetchSessionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const session = await SessionService.getById(id);
      set({ selectedSession: session });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch session" });
    } finally {
      set({ loading: false });
    }
  },

  addSession: async (data) => {
    set({ loading: true, error: null });
    try {
      const newSession = await SessionService.create(data);
      set((state) => ({ sessions: [...state.sessions, newSession] }));
    } catch (error: any) {
      set({ error: error.message || "Failed to add session" });
    } finally {
      set({ loading: false });
    }
  },

  updateSession: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await SessionService.update(id, data);
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update session" });
    } finally {
      set({ loading: false });
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await SessionService.delete(id);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to delete session" });
    } finally {
      set({ loading: false });
    }
  },

  // ===== New functions =====
  getStudentSessions: async (studentId: number) => {
    try {
      const data = await SessionService.getStudentSessions(studentId);
      return data;
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch student sessions" });
      return [];
    }
  },

  updateAttendanceState: async (attendanceId: number, presenceType: number) => {
    try {
      const result = await SessionService.updateAttendanceState(
        attendanceId,
        presenceType
      );
      return result;
    } catch (error: any) {
      set({ error: error.message || "Failed to update attendance" });
      throw error;
    }
  },
}));
