import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PresenceResponse } from "@/services/presencesService";
import PresenceUpdateDialog from "./PresenceUpdateDialog";

type PresencesTableProps = {
  data: PresenceResponse[];
};

export default function PresencesTable({ data }: PresencesTableProps) {
  const [selectedPresence, setSelectedPresence] = useState<PresenceResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Group presences by student
  const groupedData = useMemo(() => {
    const groups: Record<string, PresenceResponse[]> = {};
    data.forEach(presence => {
      const key = `${presence.studentName}-${presence.groupName}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(presence);
    });
    return Object.values(groups);
  }, [data]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">P</Badge>;
      case 1:
        return <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>;
      case 2:
        return <Badge variant="secondary" className="bg-red-100 text-red-800">✗</Badge>;
      default:
        return <Badge variant="secondary">?</Badge>;
    }
  };

  const handleUpdatePresence = (presence: PresenceResponse) => {
    setSelectedPresence(presence);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Sessions Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupedData.map((presences, index) => {
              const firstPresence = presences[0];
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{firstPresence.studentName}</TableCell>
                  <TableCell>{firstPresence.groupName}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {presences.map((presence) => (
                        <button
                          key={presence.id}
                          onClick={() => handleUpdatePresence(presence)}
                          className="cursor-pointer"
                          title={`${presence.sessionDate} - Click to update`}
                        >
                          {getStatusBadge(presence.presenceStatus)}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {presences.length} session{presences.length > 1 ? 's' : ''}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PresenceUpdateDialog
        presence={selectedPresence}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
