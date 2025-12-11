import api from "@/lib/api";

export interface StudentRequest {
  name: string;
  phoneNumber: string;
}

export interface Presence {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  presenceStatus: number; // 0=Pending, 1=Present, 2=Absent
}

export interface StudentResponse {
  id: number;
  name: string;
  phoneNumber: string;
  enrollments: GroupEnrollmentInfo[];
  presences: Presence[];
}

export interface GroupEnrollmentInfo {
  groupId: number;
  groupName: string;
  teacherId: number;
  teacherName: string;
}

const StudentService = {
  // ✅ Get all students
  async getAll(): Promise<StudentResponse[]> {
    const res = await api.get("/students");
    return res.data;
  },

  // ✅ Get a specific student by ID
  async getById(id: number): Promise<StudentResponse> {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },

  // ✅ Create a new student
  async create(data: StudentRequest): Promise<StudentResponse> {
    const res = await api.post("/students", data);
    return res.data;
  },

  // ✅ Update an existing student
  async update(id: number, data: StudentRequest): Promise<StudentResponse> {
    const res = await api.put(`/students/${id}`, data);
    return res.data;
  },

  // ✅ Delete a student
  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};

export default StudentService;
