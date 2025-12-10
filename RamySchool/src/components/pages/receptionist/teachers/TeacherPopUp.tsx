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
import { useTeacherStore } from "@/stores/teachersStore";
import { ConfirmDialog } from "@/components/ui/confirmationDialog";

interface TeachersDialogProps {
  mode: "add" | "edit";
  defaultValues?: {
    id?: number;
    fullName: string;
    salary: number;
    percentage: number;
  };
}

export default function TeachersDialog({ mode, defaultValues }: TeachersDialogProps) {
  const [open, setOpen] = useState(false);
  const { addTeacher, updateTeacher } = useTeacherStore();

  const [form, setForm] = useState({
    fullName: "",
    salary: "",
    percentage: "",
  });

  useEffect(() => {
    if (defaultValues) {
      setForm({
        fullName: defaultValues.fullName || "",
        salary: defaultValues.salary?.toString() || "",
        percentage: defaultValues.percentage?.toString() || "",
      });
    } else {
      setForm({ fullName: "", salary: "", percentage: "" });
    }
  }, [defaultValues, open]);

  const handleSubmit = async () => {
    if (!form.fullName || !form.salary || !form.percentage) return;

    const teacherData = {
      fullName: form.fullName,
      salary: parseFloat(form.salary),
      percentage: parseFloat(form.percentage),
    };

    if (mode === "add") {
      await addTeacher(teacherData);
    } else if (mode === "edit" && defaultValues?.id) {
      console.log("updated one:",teacherData);
      await updateTeacher(defaultValues.id, teacherData);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="rounded-full" variant="secondary">
            Add New Teacher <PlusIcon className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <EditButton />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Teacher" : "Edit Teacher"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Mr. Ali"
            />
          </div>

          <div>
            <Label>Salary (DZD)</Label>
            <Input
              type="number"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="e.g. 85000"
            />
          </div>

          <div>
            <Label>Percentage (%)</Label>
            <Input
              type="number"
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: e.target.value })}
              placeholder="e.g. 40"
            />
          </div>
        </div>

         <DialogFooter>
          <ConfirmDialog
            title={mode === "add" ? "Confirm New Teacher" : "Confirm Changes"}
            description={
              mode === "add"
                ? "Are you sure you want to add this teacher?"
                : "Are you sure you want to save these changes?"
            }
            confirmText={mode === "add" ? "Add Teacher" : "Save Changes"}
            cancelText="Cancel"
            variant={mode === "add" ? "green" : "normal"}
            triggerLabel={mode === "add" ? "Add Teacher" : "Save Changes"}
            onConfirm={handleSubmit}
          >
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Full Name:</strong> {form.fullName || "Not provided"}
              </p>
              <p>
                <strong>Salary:</strong> {form.salary || "Not provided"} DZD
              </p>
              <p>
                <strong>Percentage:</strong> {form.percentage || "Not provided"}%
              </p>
            </div>
          </ConfirmDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
