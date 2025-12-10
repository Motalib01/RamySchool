import api from "@/lib/api";

export interface PresenceRequest {
  studentId: number;
  sessionId: number;
  isPresent: boolean;
}

export interface PresenceResponse {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  isPresent: boolean;
}

const PresenceService = {
  
  async getAll(): Promise<PresenceResponse[]> {
    const res = await api.get("/Presences");
    return res.data;
  },

 
  async getById(id: number): Promise<PresenceResponse> {
    const res = await api.get(`/Presences/${id}`);
    return res.data;
  },

 
  async create(data: PresenceRequest): Promise<PresenceResponse> {
    const res = await api.post("/Presences", data);
    return res.data;
  },

 
  async update(id: number, data: PresenceRequest): Promise<PresenceResponse> {
    const res = await api.put(`/Presences/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Presences/${id}`);
  },
};

export default PresenceService;
