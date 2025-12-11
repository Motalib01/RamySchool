import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UserPlusIcon } from "lucide-react";
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

export default function EnrollmentDialog() {
  const [open, setOpen] = useState(false);
  const { groups, fetchGroups } = useGroupStore();
  const { students, fetchStudents } = useStudentsStore();

  const [form, setForm] = useState({
    studentId: 0,
    groupId: 0,
    initialSessionsCount: 4,
    initialSessionStartAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchGroups();
      fetchStudents();
      setForm(prev => ({
        ...prev,
        initialSessionStartAt: new Date().toISOString().split('T')[0]
      }));
    }
  }, [open, fetchGroups, fetchStudents]);

  const handleSubmit = async () => {
    if (!form.studentId || !form.groupId) {
      setError("Please select both a student and a group.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await EnrollmentService.create({
        studentId: form.studentId,
        groupId: form.groupId,
        initialSessionsCount: form.initialSessionsCount,
        initialSessionStartAt: form.initialSessionStartAt + "T10:00:00Z"
      });
      
      await fetchStudents();
      
      setForm({ studentId: 0, groupId: 0, initialSessionsCount: 4, initialSessionStartAt: "" });
      setOpen(false);
      
      alert("Student enrolled successfully! Sessions and presences have been created.");
    } catch (err: any) {
      console.error("Error enrolling student:", err);
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          Enroll Student <UserPlusIcon className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Enroll Student in Group</DialogTitle>
          <DialogDescription>
            Select a student and group to create an enrollment with automatic session and presence creation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div>
            <Label>Student</Label>
            <Select
              value={form.studentId ? String(form.studentId) : ""}
              onValueChange={(val) =>
                setForm({ ...form, studentId: Number(val) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={String(student.id)}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Group</Label>
            <Select
              value={form.groupId ? String(form.groupId) : ""}
              onValueChange={(val) =>
                setForm({ ...form, groupId: Number(val) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    {group.name} - {group.teacherName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Initial Sessions Count</Label>
            <Input
              type="number"
              value={form.initialSessionsCount}
              onChange={(e) =>
                setForm({ ...form, initialSessionsCount: Number(e.target.value) })
              }
              min="1"
              max="20"
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={form.initialSessionStartAt}
              onChange={(e) =>
                setForm({ ...form, initialSessionStartAt: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
