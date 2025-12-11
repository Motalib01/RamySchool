import api from "@/lib/api";

export interface AttendanceRequest {
  studentId: number;
  sessionId: number;
  status: number; // 0=Pending, 1=Present, 2=Absent
}

export interface AttendanceResponse {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  presenceStatus: number;
}

const AttendanceService = {
  async update(data: AttendanceRequest): Promise<AttendanceResponse> {
    const res = await api.post("/attendance", data);
    return res.data;
  },
};

export default AttendanceService;