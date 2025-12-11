import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentService, { StudentResponse } from "@/services/studentsService";
import { getGroups } from "@/services/groupService";
import EnrollmentService from "@/services/enrollmentService";
// import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
}

interface EnrollmentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EnrollmentPopup({ open, onOpenChange, onSuccess }: EnrollmentPopupProps) {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [studentsData, groupsData] = await Promise.all([
        StudentService.getAll(),
        getGroups()
      ]);
      setStudents(studentsData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudentId || !selectedGroupId) {
      alert("Please select both student and group");
      return;
    }

    setLoading(true);
    try {
      await EnrollmentService.create({
        studentId: parseInt(selectedStudentId),
        groupId: parseInt(selectedGroupId),
      });
      
      alert("Student enrolled successfully");
      onSuccess?.();
      handleClose();
    } catch (error) {
      alert("Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStudentId("");
    setSelectedGroupId("");
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
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name} - {student.phoneNumber}
                  </SelectItem>
                ))}
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
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name} - {group.teacherName}
                  </SelectItem>
                ))}
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