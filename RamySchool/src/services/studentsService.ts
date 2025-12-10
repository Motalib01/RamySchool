import api from "@/lib/api";

export interface StudentRequest {
  name: string;
  phoneNumber: string;
  groupId: number;
}

export interface Presence {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  isPresent: boolean;
}

export interface StudentResponse {
  id: number;
  name: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
  teacherName: string;
  presences: Presence[];
}

const StudentService = {
  // ✅ Get all students
  async getAll(): Promise<StudentResponse[]> {
    const res = await api.get("/Students");
    return res.data;
  },

  // ✅ Get a specific student by ID
  async getById(id: number): Promise<StudentResponse> {
    const res = await api.get(`/Students/${id}`);
    return res.data;
  },

  // ✅ Create a new student
  async create(data: StudentRequest): Promise<StudentResponse> {
    const res = await api.post("/Students", data);
    return res.data;
  },

  // ✅ Update an existing student
  async update(id: number, data: StudentRequest): Promise<StudentResponse> {
    const res = await api.put(`/Students/${id}`, data);
    return res.data;
  },

  // ✅ Delete a student
  async delete(id: number): Promise<void> {
    await api.delete(`/Students/${id}`);
  },
};

export default StudentService;
