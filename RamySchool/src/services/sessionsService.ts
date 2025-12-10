import api from "@/lib/api";

export interface SessionRequest {
  type: number; 
  dateSession: string; 
  price: number;
  groupId: number;
}

export interface SessionResponse {
  id: number;
  type: number;
  dateSession: string;
  price: number;
  groupName: string;
  teacherName: string;
}

export interface AttendanceResponse {
    attendanceId: number;
    sessionId: number;
    sessionType: number;
    type: 0 | 1 | 2; // 0 = pending, 1 = present, 2 = absent
    studentId: number;
  }

const SessionService = {
  
  async getAll(): Promise<SessionResponse[]> {
    const res = await api.get("/Sessions");
    return res.data;
  },

  
  async getById(id: number): Promise<SessionResponse> {
    const res = await api.get(`/Sessions/${id}`);
    return res.data;
  },

  async getStudentSessions(studentId: number): Promise<AttendanceResponse[]> {
    const res = await api.get(`/Sessions/student/${studentId}`);
    return res.data;
  },

  async updateAttendanceState(attendanceId: number, presenceType: number): Promise<string> {
    const res = await api.put(`/Sessions/attendance/${attendanceId}`, {presenceType});
    return res.data;
  },

  
  async create(data: SessionRequest): Promise<SessionResponse> {
    const res = await api.post("/Sessions", data);
    return res.data;
  },

  
  async update(id: number, data: SessionRequest): Promise<SessionResponse> {
    const res = await api.put(`/Sessions/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Sessions/${id}`);
  },
};

export default SessionService;
