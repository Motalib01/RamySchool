import { create } from "zustand";
import {
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  TeacherRequest,
  TeacherResponse,
  fetchStudentSessionsForTeacher,
  SessionResponse,
} from "@/services/teachersService";

interface TeacherStore {
  teachers: TeacherResponse[];
  studentSessions: Record<number, SessionResponse[]>;
  loading: boolean;
  error: string | null;

  fetchTeachers: () => Promise<void>;
  addTeacher: (data: TeacherRequest) => Promise<void>;
  updateTeacher: (id: number, data: TeacherRequest) => Promise<void>;
  deleteTeacher: (id: number) => Promise<void>;
  fetchStudentSessionsForTeacher: (studentId: number) => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>((set, get) => ({
  teachers: [],
  studentSessions: {},
  loading: false,
  error: null,

  // ✅ Fetch all teachers
  fetchTeachers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTeachers();
      set({ teachers: data });
    } catch (error: any) {
      const errorMessage = error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' 
        ? "Cannot connect to server. Please ensure the API server is running on http://localhost:5132"
        : error.message || "Failed to fetch teachers";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Add teacher
  addTeacher: async (data) => {
    set({ loading: true, error: null });
    try {
      const newTeacher = await addTeacher(data);
      set({ teachers: [...get().teachers, newTeacher] });
    } catch (error: any) {
      set({ error: error.message || "Failed to add teacher" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Update teacher
  updateTeacher: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedTeacher = await updateTeacher(id, data);
      set({
        teachers: get().teachers.map((t) =>
          t.id === id ? updatedTeacher : t
        ),
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to update teacher" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Delete teacher
  deleteTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteTeacher(id);
      set({
        teachers: get().teachers.filter((t) => t.id !== id),
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete teacher" });
    } finally {
      set({ loading: false });
    }
  },
  fetchStudentSessionsForTeacher: async (studentId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchStudentSessionsForTeacher(studentId);
      set((state) => ({
        studentSessions: {
          ...state.studentSessions,
          [studentId]: data,
        },
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch sessions" });
    } finally {
      set({ loading: false });
    }
  },

}));
