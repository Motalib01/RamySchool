import api from "@/lib/api";

export interface TeacherRequest {
  fullName: string;
  salary: number;
  percentage: number;
}

export interface Presence {
  id: number;
  studentName: string;
  groupName: string;
  sessionDate: string;
  isPresent: boolean;
}

export interface Student {
  id: number;
  name: string;
  phoneNumber: string;
  groupId: number;
  groupName: string;
  teacherName: string;
  presences: Presence[];
}

export interface Group {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students: Student[];
}

export interface TeacherResponse {
  id: number;
  fullName: string;
  salary: number;
  percentage: number;
  groups: Group[];
}

export interface SessionResponse{
    sessionId: number;
    sessionNumber: number;
    date: string;
    isPresent: boolean;
}

export async function fetchTeachers(): Promise<TeacherResponse[]> {
  const res = await api.get("/Teachers");
  return res.data;
}

export async function fetchStudentSessionsForTeacher(studentId: number): Promise<SessionResponse[]> {
  const res = await api.get(`/Teachers/student/${studentId}/sessions`);
  return res.data;
}

export async function addTeacher(data: TeacherRequest): Promise<TeacherResponse> {
  const res = await api.post("/Teachers", data);
  return res.data;
}

export async function updateTeacher(
  id: number,
  data: TeacherRequest
): Promise<TeacherResponse> {
  const res = await api.put(`/Teachers/${id}`, data);
  return res.data;
}

export async function deleteTeacher(id: number): Promise<void> {
  await api.delete(`/Teachers/${id}`);
}