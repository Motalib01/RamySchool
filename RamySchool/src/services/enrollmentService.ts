import api from "@/lib/api";

export interface EnrollmentRequest {
  studentId: number;
  groupId: number;
  initialSessionsCount: number;
  initialSessionStartAt?: string;
}

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  groupId: number;
}

const EnrollmentService = {
  async create(data: EnrollmentRequest): Promise<EnrollmentResponse> {
    const res = await api.post("/enrollments", data);
    return res.data;
  },
};

export default EnrollmentService;