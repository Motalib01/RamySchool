import { create } from "zustand";
import SessionService, {
  SessionRequest,
  SessionResponse,
} from "@/services/sessionsService";


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

  addSessionToGroup: (groupId: number, data: SessionRequest) => Promise<void>;
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
      const errorMessage = error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' 
        ? "Cannot connect to server. Please ensure the API server is running on http://localhost:5132"
        : error.message || "Failed to fetch sessions";
      set({ error: errorMessage });
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

  addSessionToGroup: async (groupId: number, data: SessionRequest) => {
    set({ loading: true, error: null });
    try {
      await SessionService.addSessionToGroup(groupId, data);
      const updated = await SessionService.getAll();
      set({ sessions: updated });
    } catch (err: any) {
      set({ error: err.message || "Failed to add session to group" });
    } finally {
      set({ loading: false });
    }
  },
}));
