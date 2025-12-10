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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import EditButton from "@/components/ui/editButton";
import { useGroupStore } from "@/stores/groupStore";
import { useTeacherStore } from "@/stores/teachersStore";
import { ConfirmDialog } from "@/components/ui/confirmationDialog";

interface GroupDialogProps {
  mode: "add" | "edit";
  defaultValues?: {
    id: number;
    groupName: string;
    teacherId: number;
    teacherName: string;
    students?: { id: number; name: string }[];
  };
}

export default function GroupDialog({
  mode,
  defaultValues,
}: GroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false);

  const { createGroup, editGroup } = useGroupStore();
  const { teachers, fetchTeachers } = useTeacherStore();

  const [form, setForm] = useState({
    groupName: "",
    teacherId: 0,
  });

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    if (defaultValues) {
      setForm({
        groupName: defaultValues.groupName || "",
        teacherId: defaultValues.teacherId || 0,
      });
    } else {
      setForm({ groupName: "", teacherId: 0 });
    }
  }, [defaultValues, open]);

  const handleSubmit = async () => {
    if (!form.groupName || !form.teacherId) return;

    if (mode === "add") {
      await createGroup(form.groupName, form.teacherId);
    } else if (mode === "edit" && defaultValues) {
      await editGroup(defaultValues.id, form.groupName, form.teacherId);
    }

    setOpen(false);
  };

  const selectedTeacherName =
    teachers.find((t) => t.id === form.teacherId)?.fullName || "Select teacher";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="rounded-full" variant="secondary">
            Add New Group <PlusIcon className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <EditButton />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Group" : "Edit Group"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div>
            <Label>Group Name</Label>
            <Input
              value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })}
              placeholder="e.g. Group A"
            />
          </div>

          <div>
            <Label>Teacher</Label>
            <Popover open={teacherPickerOpen} onOpenChange={setTeacherPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="justify-between">
                  {selectedTeacherName}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search teacher..." />
                  <CommandEmpty>No teachers found.</CommandEmpty>
                  <CommandGroup>
                    {teachers.map((teacher) => (
                      <CommandItem
                        key={teacher.id}
                        onSelect={() =>{
                          setForm({ ...form, teacherId: teacher.id });
                        setTeacherPickerOpen(false);}
                        }
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.teacherId === teacher.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {teacher.fullName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Show students only in edit mode */}
          {mode === "edit" && defaultValues?.students?.length ? (
            <div className="flex flex-col gap-2">
              <Label>Students</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {defaultValues.students.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-1 bg-gray-100 text-sm rounded-md border"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
  <ConfirmDialog
    title={mode === "add" ? "Create New Group" : "Save Changes?"}
    description={
      mode === "add"
        ? "Are you sure you want to create this new group?"
        : "Are you sure you want to save the changes to this group?"
    }
    confirmText={mode === "add" ? "Create" : "Save"}
    cancelText="Cancel"
    variant="green"
    triggerLabel={mode === "add" ? "Add Group" : "Save Changes"}
    onConfirm={handleSubmit}
  />
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
