import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DeleteButton from "@/components/ui/deleteButton"
import TeachersDialog from "./TeacherPopUp"
import { TeacherResponse } from "@/services/teachersService"
import { useTeacherStore } from "@/stores/teachersStore"

interface TeachersTableProps {
  data: TeacherResponse[]
}

export default function TeachersTable({ data }: TeachersTableProps) {
  const { deleteTeacher } = useTeacherStore();
  const handleDelete = async (id: number) => {
      await deleteTeacher(id);
    }
  if (!Array.isArray(data)) return <p>No teachers found.</p>;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead className="text-right">Salary (DZD)</TableHead>
            <TableHead className="text-right">Percentage (%)</TableHead>
            <TableHead className="text-right">Groups</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>
              <TableCell className="font-medium">
                {teacher.fullName || "—"}
              </TableCell>
              <TableCell className="text-right">
                {teacher.salary?.toLocaleString("en-DZ") ?? 0}
              </TableCell>
              <TableCell className="text-right">
                {teacher.percentage ?? 0}%
              </TableCell>
              <TableCell className="text-right">
                {teacher.groups?.length
                  ? teacher.groups.map((g) => g.name).join(", ")
                  : "—"}
              </TableCell>
              <TableCell className="flex gap-1 justify-end">
                <TeachersDialog mode="edit" defaultValues={teacher} />
                <DeleteButton onConfirm={()=>{handleDelete(teacher.id)}}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
