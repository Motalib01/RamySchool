import { create } from "zustand";
import PresenceService, {
  PresenceRequest,
  PresenceResponse,
} from "@/services/presencesService";

interface PresenceState {
  presences: PresenceResponse[];
  loading: boolean;
  error: string | null;

  fetchPresences: () => Promise<void>;
  addPresence: (data: PresenceRequest) => Promise<void>;
  updatePresence: (id: number, data: PresenceRequest) => Promise<void>;
  removePresence: (id: number) => Promise<void>;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  presences: [],
  loading: false,
  error: null,

  fetchPresences: async () => {
    set({ loading: true, error: null });
    try {
      const data = await PresenceService.getAll();
      set({ presences: data });
    } catch (error: any) {
      const errorMessage = error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' 
        ? "Cannot connect to server. Please ensure the API server is running on http://localhost:5132"
        : "Failed to fetch presences";
      set({ error: errorMessage });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  addPresence: async (data: PresenceRequest) => {
    try {
      const newPresence = await PresenceService.create(data);
      set({ presences: [...get().presences, newPresence] });
    } catch (error) {
      console.error(error);
    }
  },

  updatePresence: async (id: number, data: PresenceRequest) => {
    try {
      const updatedPresence = await PresenceService.update(id, data);
      set({
        presences: get().presences.map((p) =>
          p.id === id ? updatedPresence : p
        ),
      });
    } catch (error) {
      console.error(error);
    }
  },

  removePresence: async (id: number) => {
    try {
      await PresenceService.delete(id);
      set({
        presences: get().presences.filter((p) => p.id !== id),
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
