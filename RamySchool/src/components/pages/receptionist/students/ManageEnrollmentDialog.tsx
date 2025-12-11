import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useGroupStore } from "@/stores/groupStore";
import { useStudentsStore } from "@/stores/studentsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EnrollmentService from "@/services/enrollmentService";

export default function ManageEnrollmentDialog() {
  const { groups, fetchGroups } = useGroupStore();
  const { students, fetchStudents } = useStudentsStore();

  const [studentId, setStudentId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      setDataLoading(true);
      try {
        await Promise.all([fetchGroups(), fetchStudents()]);
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load students and groups");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [open, fetchGroups, fetchStudents]);

  const handleSubmit = async () => {
    if (!studentId || !groupId) {
      setError("Please select both a student and a group.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await EnrollmentService.create({
        studentId: Number(studentId),
        groupId: Number(groupId),
      });

      setStudentId("");
      setGroupId("");
      setOpen(false);
      alert("Student enrolled in group successfully!");
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
          Manage Enrollment <UserPlus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll Student in Group</DialogTitle>
          <DialogDescription>
            Select a student and a group to enroll the student in that group.
          </DialogDescription>
        </DialogHeader>

        {dataLoading ? (
          <div className="py-4 text-center text-gray-500">Loading students and groups...</div>
        ) : (
          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students && students.length > 0 ? (
                    students.map((student) => (
                      <SelectItem key={student.id} value={String(student.id)}>
                        {student.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No students available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select value={groupId} onValueChange={setGroupId}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups && groups.length > 0 ? (
                    groups.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name} - {group.teacherName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No groups available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || dataLoading || !studentId || !groupId}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Enrolling..." : "Enroll"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}