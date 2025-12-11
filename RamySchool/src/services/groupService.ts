import api from "@/lib/api";

export interface GroupRequest {
  name: string;
  teacherId: number;
}


export const addGroup = async (data: GroupRequest) => {
  const res = await api.post("/groups", data);
  return res.data;
};


export const updateGroup = async (id: number, data: GroupRequest) => {
  const res = await api.put(`/groups/${id}`, data);
  return res.data;
};


export const getGroups = async () => {
  const res = await api.get("/groups");
  return res.data;
};


export const getGroupById = async (id: number) => {
  const res = await api.get(`/groups/${id}`);
  return res.data;
};


export const deleteGroup = async (id: number) => {
  const res = await api.delete(`/groups/${id}`);
  return res.data;
};
