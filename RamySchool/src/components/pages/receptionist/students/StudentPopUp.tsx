import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import EditButton from "@/components/ui/editButton";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Status } from "@/components/ui/status";
import { useGroupStore } from "@/stores/groupStore";
import { useStudentsStore } from "@/stores/studentsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentResponse } from "@/services/studentsService";
import { ConfirmDialog } from "@/components/ui/confirmationDialog";


interface StudentsDialogProps {
  mode: "add" | "edit";
  defaultValues?: StudentResponse;
}

export default function StudentsDialog({
  mode,
  defaultValues,
}: StudentsDialogProps) {
  const [open, setOpen] = useState(false);
  const { groups, fetchGroups } = useGroupStore();
  const { addStudent, editStudent } = useStudentsStore();
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
  });

  // Fetch groups when dialog opens
  useEffect(() => {
    if (open) fetchGroups();
  }, [open, fetchGroups]);

  // Initialize form and fetch student sessions when editing
  useEffect(() => {
    if (defaultValues) {
      setForm({
        name: defaultValues.name || "",
        phoneNumber: defaultValues.phoneNumber || "",
      });

    } else {
      setForm({ name: "", phoneNumber: "" });
    }
  }, [defaultValues, open, mode]);



  const handleSubmit = async () => {
    if (!form.name || !form.phoneNumber) return;

    const payload = {
      name: form.name,
      phoneNumber: form.phoneNumber,
    };

    try {
      if (mode === "add") {
        await addStudent(payload);
      } else if (mode === "edit" && defaultValues) {
        await editStudent(defaultValues.id, payload);
      }
      setOpen(false);
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="rounded-full" variant="secondary">
            Add New Student <PlusIcon className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <EditButton />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div>
            <Label>Student Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ahmed B."
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              placeholder="e.g. 0551-123-456"
            />
          </div>



          {/* {mode === "edit" && studentSessions.length > 0 && (
            <div>
              <Label>Recent Presences</Label>
              <div className="flex gap-1 mt-1">
                <TooltipProvider>
                  {studentSessions
                    .slice(-5)
                    .map((p, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <Status
                            value={p.type ? "success" : "error"}
                            size="sm"
                            label=""
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {p.type ? "Present" : "Absent"}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </TooltipProvider>
              </div>
            </div>
          )} */}
        </div>

        <DialogFooter>
          <ConfirmDialog
            title={mode === "add" ? "Confirm New Student" : "Confirm Changes"}
            description={
              mode === "add"
                ? "Are you sure you want to add this student?"
                : "Are you sure you want to save these changes?"
            }
            confirmText={mode === "add" ? "Add Student" : "Save Changes"}
            cancelText="Cancel"
            variant={mode === "add" ? "green" : "normal"}
            triggerLabel={mode === "add" ? "Add Student" : "Save Changes"}
            onConfirm={handleSubmit}
          >
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Name:</strong> {form.name || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {form.phoneNumber || "Not provided"}
              </p>

            </div>
          </ConfirmDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
