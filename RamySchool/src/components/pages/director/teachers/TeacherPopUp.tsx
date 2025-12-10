import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ViewButton from "@/components/ui/viewButton";
import { useFinanceStore } from "@/stores/revenuesStore";

interface TeacherViewDialogProps {
  teacher: {
    id: number;
    fullName: string;
    salary: number;
    percentage: number;
  };
}

export default function TeacherViewDialog({ teacher }: TeacherViewDialogProps) {
  const [open, setOpen] = useState(false);
  const { getTeacherRevenue, teacherRevenue, loading } = useFinanceStore();

  useEffect(() => {
    if (open) {
      getTeacherRevenue(teacher.id);
    }
  }, [open, teacher.id, getTeacherRevenue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ViewButton onClick={() => setOpen(true)} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
          <DialogDescription>
            Here you can view information about this teacher.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm py-2">
          <div className="flex justify-between">
            <span className="font-semibold">ID:</span>
            <span>{teacher.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{teacher.fullName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Salary:</span>
            <span>{teacher.salary.toLocaleString("en-DZ")} DZD</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Percentage:</span>
            <span>{teacher.percentage}%</span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold">Revenue:</span>
            {loading ? (
              <span className="text-gray-500">Loading...</span>
            ) : teacherRevenue !== null ? (
              <span className="text-green-600 font-medium">
                {teacherRevenue.toLocaleString("en-DZ")} DZD
              </span>
            ) : (
              <span className="text-red-500">Failed to load</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
