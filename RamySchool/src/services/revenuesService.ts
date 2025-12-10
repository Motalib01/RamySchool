// src/services/financeService.ts
import api from "@/lib/api";

// ✅ Response types
export interface TotalResponse {
  total: number;
}

export interface NetResponse {
  net: number;
}

export interface TeacherFinanceResponse {
  teacherId: number;
  revenue: number;
}

// ✅ Fetch total revenue
export async function fetchTotal(): Promise<TotalResponse> {
  const res = await api.get("/Finance/total");
  return res.data;
}

// ✅ Fetch net revenue
export async function fetchNet(): Promise<NetResponse> {
  const res = await api.get("/Finance/net");
  return res.data;
}

// ✅ Fetch teacher-specific revenue
export async function fetchTeacherRevenue(
  teacherId: number
): Promise<TeacherFinanceResponse> {
  const res = await api.get(`/Finance/teacher/${teacherId}`);
  return res.data;
}
