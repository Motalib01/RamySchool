import { create } from "zustand";
import StudentService, {
  StudentResponse,
  StudentRequest,
} from "@/services/studentsService";

interface StudentsStore {
  students: StudentResponse[];
  selectedStudent: StudentResponse | null;
  loading: boolean;
  error: string | null;

  fetchStudents: () => Promise<void>;
  fetchStudentById: (id: number) => Promise<void>;
  addStudent: (data: StudentRequest) => Promise<void>;
  editStudent: (id: number, data: StudentRequest) => Promise<void>;
  removeStudent: (id: number) => Promise<void>;
  clearSelectedStudent: () => void;
}

export const useStudentsStore = create<StudentsStore>((set) => ({
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,

  
  fetchStudents: async () => {
    try {
      set({ loading: true, error: null });
      const data = await StudentService.getAll();
      set({ students: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch students", loading: false });
    }
  },

  
  fetchStudentById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await StudentService.getById(id);
      set({ selectedStudent: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch student details", loading: false });
    }
  },

  addStudent: async (data) => {
    try {
      set({ loading: true, error: null });
      await StudentService.create(data);
      const updated = await StudentService.getAll();
      set({ students: updated, loading: false });
    } catch (err) {
      set({ error: "Failed to add student", loading: false });
    }
  },

  
  editStudent: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await StudentService.update(id, data);
      const updated = await StudentService.getAll();
      set({ students: updated, loading: false });
    } catch (err) {
      set({ error: "Failed to update student", loading: false });
    }
  },

  
  removeStudent: async (id) => {
    try {
      set({ loading: true, error: null });
      await StudentService.delete(id);
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete student", loading: false });
    }
  },

  
  clearSelectedStudent: () => set({ selectedStudent: null }),
}));
