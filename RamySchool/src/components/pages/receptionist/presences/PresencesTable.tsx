import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Status } from "@/components/ui/status";
import { useTeacherStore } from "@/stores/teachersStore";
import PresenceDialog from "./PresenceDialog";
import { StudentResponse } from "@/services/studentsService";

type PresencesTableProps = {
  data: StudentResponse[];
};

type TeacherSession = {
  sessionId: number;
  sessionNumber?: number;
  date?: string;
  type?: number; // 0 pending,1 present,2 absent
  sessionType?: number;
  // may include other fields
};

export default function PresencesTable({ data }: PresencesTableProps) {
  const { fetchStudentSessionsForTeacher, studentSessions } = useTeacherStore();

  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
  const [selectedSession, setSelectedSession] = useState<TeacherSession | null>(null);

  // Local overlay for optimistic updates: studentId -> TeacherSession[]
  const [localSessions, setLocalSessions] = useState<Record<number, TeacherSession[]>>({});

  useEffect(() => {
    data.forEach((student: StudentResponse) => {
      fetchStudentSessionsForTeacher(student.id);
    });
  }, [data, fetchStudentSessionsForTeacher]);

  // Helper: decide Status props from session object using `type` as canonical
  const presencePropsFromSession = (session: any) => {
    if (typeof session.type !== "undefined") {
      if (session.type === 0) return { value: "pending", label: "Pending" };
      if (session.type === 1) return { value: "present", label: "Present" };
      if (session.type === 2) return { value: "absent", label: "Absent" };
    }
    if (typeof session.isPresent !== "undefined") {
      return session.isPresent ? { value: "present", label: "Present" } : { value: "absent", label: "Absent" };
    }
    return { value: "pending", label: "Pending" };
  };

  // Parent handler called by dialog after successful update
  const handleSaved = (studentId: number, updatedSession: any) => {
    setLocalSessions((prev) => {
      const existing = prev[studentId] ?? studentSessions[studentId] ?? [];

      // find by sessionId (teacher sessions) and replace
      const idx = existing.findIndex((s: any) => Number(s.sessionId) === Number(updatedSession.sessionId));
      let next: TeacherSession[];
      if (idx >= 0) {
        next = [...existing];
        // merge to preserve other fields (like sessionNumber, date)
        next[idx] = { ...next[idx], ...updatedSession };
      } else {
        // append if not present
        next = [...existing, updatedSession];
      }

      return { ...prev, [studentId]: next };
    });

    // close dialog by clearing selection
    setSelectedStudent(null);
    setSelectedSession(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Group</TableHead>
              <TableHead className="text-center">Presences</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((student: StudentResponse) => {
              // prefer local overlay, then store sessions
              const sessions: TeacherSession[] = (localSessions[student.id] ?? studentSessions[student.id] ?? []) as TeacherSession[];

              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.groupName}</TableCell>

                  <TableCell className="flex items-center justify-center">
                    <div className="flex gap-1">
                      {sessions
                        .slice(-5) // show last 5
                        .map((session: any) => {
                          const { value, label } = presencePropsFromSession(session);
                          const clickable = value === "pending";

                          return (
                            <button
                              key={session.sessionId ?? `${student.id}-${Math.random()}`}
                              onClick={() => {
                                if (!clickable) return;
                                const s = { id: student.id, name: student.name };
                                console.log("PresencesTable: selecting", { student: s, session });
                                setSelectedStudent(s);
                                setSelectedSession(session);
                              }}
                              className={clickable ? "cursor-pointer" : "cursor-default"}
                              title={clickable ? "Set presence" : label}
                            >
                              <Status value={value as any} label={label} />
                            </button>
                          );
                        })}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedStudent && selectedSession && (
        <PresenceDialog
          student={selectedStudent}
          session={selectedSession}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedStudent(null);
              setSelectedSession(null);
            }
          }}
          onSaved={(studentId: number, updatedSession: any) => handleSaved(studentId, updatedSession)}
        />
      )}
    </>
  );
}
