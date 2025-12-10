import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/ui/deleteButton";
import GroupDialog from "./GroupPopUp";
import { useGroupStore } from "@/stores/groupStore";

interface Student {
  id: number;
  name: string;
}

interface Group {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  students: Student[];
}

interface GroupsTableProps {
  data: Group[];
}

export default function GroupsTable({ data }: GroupsTableProps) {
  const { removeGroup } = useGroupStore();

  const truncateStudents = (students: Student[], max = 3) => {
    if (students.length === 0) return "—";
    const names = students.map((s) => s.name);
    if (names.length <= max) return names.join(", ");
    return names.slice(0, max).join(", ") + "…";
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      await removeGroup(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Group ID</TableHead>
            <TableHead>Group Name</TableHead>
            <TableHead>Group Teacher</TableHead>
            <TableHead>Students</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.id}</TableCell>
              <TableCell className="font-medium">{group.name}</TableCell>
              <TableCell>{group.teacherName}</TableCell>

              <TableCell>{truncateStudents(group.students)}</TableCell>

              <TableCell className="flex gap-1 justify-end">
                <GroupDialog
                  mode="edit"
                  defaultValues={{
                    id: group.id,
                    groupName: group.name,
                    teacherId: group.teacherId,
                    teacherName: group.teacherName,
                    students: group.students,
                  }}
                />
                <DeleteButton onConfirm={() => handleDelete(group.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
