import api from "@/lib/api";

export interface SessionRequest {
  type: number;
  scheduledAt: string;
  price?: number;
}

export interface SessionResponse {
  id: number;
  type: number;
  scheduledAt: string;
  price?: number;
  groupName: string;
  teacherName: string;
  isAdditional: boolean;
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
    const res = await api.get("/sessions");
    return res.data;
  },

  
  async getById(id: number): Promise<SessionResponse> {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  },

  async addSessionToGroup(groupId: number, data: SessionRequest): Promise<SessionResponse[]> {
    const res = await api.post(`/groups/${groupId}/sessions`, data);
    return res.data;
  },

  
  async create(data: SessionRequest): Promise<SessionResponse> {
    const res = await api.post("/sessions", data);
    return res.data;
  },

  
  async update(id: number, data: SessionRequest): Promise<SessionResponse> {
    const res = await api.put(`/sessions/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/sessions/${id}`);
  },
};

export default SessionService;
