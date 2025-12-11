import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EnrollmentService from "@/services/enrollmentService";
import { useStudentsStore } from "@/stores/studentsStore"; // adjust path if needed
import { useGroupStore } from "@/stores/groupStore"; // adjust path if needed

export default function EnrollmentPopup({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  // Subscribe to stores
  const students = useStudentsStore((s) => s.students);
  const fetchStudents = useStudentsStore((s) => s.fetchStudents);

  const groups = useGroupStore((g) => g.groups);
  const fetchGroups = useGroupStore((g) => g.fetchGroups);

  // local selections and loading
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // search queries for selects
  const [studentQuery, setStudentQuery] = useState("");
  const [groupQuery, setGroupQuery] = useState("");

  // reset queries/selections when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedStudentId("");
      setSelectedGroupId("");
      setStudentQuery("");
      setGroupQuery("");
      return;
    }
    // fetch only if lists are empty (prevents unnecessary refetch)
    if (!students || students.length === 0) {
      fetchStudents().catch((e) => {
        console.error("Failed to fetch students", e);
      });
    }
    if (!groups || groups.length === 0) {
      fetchGroups().catch((e) => {
        console.error("Failed to fetch groups", e);
      });
    }
  }, [open, fetchStudents, fetchGroups]); // intentionally not adding students/groups to deps to avoid loops

  // filter lists based on queries (case-insensitive)
  const filteredStudents = useMemo(() => {
    if (!studentQuery) return students ?? [];
    const q = studentQuery.trim().toLowerCase();
    return (students ?? []).filter((s) => {
      const name = (s.name ?? "").toLowerCase();
      const phone = (s.phoneNumber ?? "").toLowerCase();
      return name.includes(q) || phone.includes(q) || String(s.id).includes(q);
    });
  }, [students, studentQuery]);

  const filteredGroups = useMemo(() => {
    if (!groupQuery) return groups ?? [];
    const q = groupQuery.trim().toLowerCase();
    return (groups ?? []).filter((g) => {
      const name = (g.name ?? "").toLowerCase();
      const teacher = (g.teacherName ?? "").toLowerCase();
      return name.includes(q) || teacher.includes(q) || String(g.id).includes(q);
    });
  }, [groups, groupQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedGroupId) {
      alert("Please select both student and group");
      return;
    }

    setLoading(true);
    try {
      await EnrollmentService.create({
        studentId: parseInt(selectedStudentId, 10),
        groupId: parseInt(selectedGroupId, 10),
      });

      // refresh groups (so the group's students array is up-to-date)
      try {
        await fetchGroups();
      } catch (err) {
        // non-fatal: still proceed
        console.warn("Failed to refresh groups after enrollment", err);
      }

      alert("Student enrolled successfully");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Enrollment failed", error);
      alert("Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStudentId("");
    setSelectedGroupId("");
    setStudentQuery("");
    setGroupQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll Student in Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>

              <SelectContent>
                {/* Search input for students */}
                <div className="px-3 py-2">
                  <input
                    type="search"
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    placeholder="Search student by name, phone or id..."
                    className="w-full rounded-md px-3 py-2 text-sm border ring-0 focus:outline-none focus:ring-1 focus:ring-primary"
                    // prevent the input from closing the select on Enter by preventing form submit bubbling
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>

                <div className="max-h-56 overflow-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No students found</div>
                  ) : (
                    filteredStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} {student.phoneNumber ? `- ${student.phoneNumber}` : ""}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="group">Group</Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>

              <SelectContent>
                {/* Search input for groups */}
                <div className="px-3 py-2">
                  <input
                    type="search"
                    value={groupQuery}
                    onChange={(e) => setGroupQuery(e.target.value)}
                    placeholder="Search group by name, teacher or id..."
                    className="w-full rounded-md px-3 py-2 text-sm border ring-0 focus:outline-none focus:ring-1 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>

                <div className="max-h-56 overflow-auto">
                  {filteredGroups.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No groups found</div>
                  ) : (
                    filteredGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name} {group.teacherName ? `- ${group.teacherName}` : ""}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
