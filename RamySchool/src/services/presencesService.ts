import api from "@/lib/api";

export interface PresenceRequest {
  studentId: number;
  sessionId: number;
  status: number; // 0=Pending, 1=Present, 2=Absent
}

export interface PresenceResponse {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  presenceStatus: number; // 0=Pending, 1=Present, 2=Absent
}

const PresenceService = {
  
  async getAll(): Promise<PresenceResponse[]> {
    const res = await api.get("/presences");
    return res.data;
  },

 
  async getById(id: number): Promise<PresenceResponse> {
    const res = await api.get(`/presences/${id}`);
    return res.data;
  },

 
  async create(data: PresenceRequest): Promise<PresenceResponse> {
    const res = await api.post("/presences", data);
    return res.data;
  },

 
  async update(id: number, data: PresenceRequest): Promise<PresenceResponse> {
    const res = await api.put(`/presences/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/presences/${id}`);
  },
};

export default PresenceService;
