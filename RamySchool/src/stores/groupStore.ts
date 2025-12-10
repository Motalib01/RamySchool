import { create } from "zustand";
import {
  addGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from "@/services/groupService";

interface Student {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students: Student[];
}

interface GroupStore {
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;

  fetchGroups: () => Promise<void>;
  fetchGroupById: (id: number) => Promise<void>;
  createGroup: (name: string, teacherId: number) => Promise<void>;
  editGroup: (id: number, name: string, teacherId: number) => Promise<void>;
  removeGroup: (id: number) => Promise<void>;
  clearSelectedGroup: () => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,

  fetchGroups: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getGroups();
      set({ groups: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch groups", loading: false });
    }
  },

  fetchGroupById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await getGroupById(id);
      set({ selectedGroup: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch group details", loading: false });
    }
  },

  createGroup: async (name, teacherId) => {
    try {
      set({ loading: true, error: null });
      await addGroup({ name, teacherId });
      const data = await getGroups();
      set({ groups: data, loading: false });
    } catch (err) {
      set({ error: "Failed to create group", loading: false });
    }
  },

  editGroup: async (id, name, teacherId) => {
    try {
      set({ loading: true, error: null });
      await updateGroup(id, { name, teacherId });
      const data = await getGroups();
      set({ groups: data, loading: false });
    } catch (err) {
      set({ error: "Failed to update group", loading: false });
    }
  },

  removeGroup: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteGroup(id);
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete group", loading: false });
    }
  },

  clearSelectedGroup: () => {
    set({ selectedGroup: null });
  },
}));
