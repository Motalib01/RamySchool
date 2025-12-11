import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/ui/deleteButton";
import SessionsDialog from "./SessionPopUp";
import { useSessionStore } from "@/stores/sessionsStore";
import { SessionResponse } from "@/services/sessionsService";


interface SessionsTableProps {
  data: SessionResponse[];
}

export default function SessionsTable({ data }: SessionsTableProps) {
  const{deleteSession}=useSessionStore();

  // Group sessions by group
  const groupedData = useMemo(() => {
    const groups: Record<string, SessionResponse[]> = {};
    data.forEach(session => {
      const key = session.groupName;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(session);
    });
    return Object.values(groups);
  }, [data]);

  const handleDelete = async (id: number) => {
    await deleteSession(id);
  };

  const getSessionBadge = (session: SessionResponse) => {
    const date = new Date(session.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    const price = session.price ? `${session.price}DA` : 'Free';
    return (
      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border" title={`${date} - ${price}`}>
        {date}
      </div>
    );
  };
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group Name</TableHead>
            <TableHead>Teacher Name</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groupedData.map((sessions, index) => {
            const firstSession = sessions[0];
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{firstSession.groupName}</TableCell>
                <TableCell>{firstSession.teacherName}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {sessions.map((session) => (
                      <div key={session.id} className="relative group">
                        {getSessionBadge(session)}
                        <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                          ID: {session.id} | {session.price ? `${session.price.toLocaleString()} DA` : 'Free'}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {sessions.length} session{sessions.length > 1 ? 's' : ''}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
