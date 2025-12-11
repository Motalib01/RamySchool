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
import { useGroupStore } from "@/stores/groupStore";
import { useSessionStore } from "@/stores/sessionsStore";
import { ConfirmDialog } from "@/components/ui/confirmationDialog";

interface SessionsDialogProps {
  mode: "add" | "edit";
  defaultValues?: {
    id?: number;
    type: number;
    dateSession: string;
    price: number;
    groupId?: number;
  };
}

export default function SessionsDialog({ mode, defaultValues }: SessionsDialogProps) {
  const [open, setOpen] = useState(false);
  const { groups } = useGroupStore();
  const { addSession, updateSession, addSessionToGroup } = useSessionStore();

  const [form, setForm] = useState({
    type: 0,
    scheduledAt: "",
    price: "",
    groupId: "",
  });

 useEffect(() => {
  if (defaultValues) {
    setForm({
      type: defaultValues.type ?? 0,
      scheduledAt: defaultValues.dateSession
        ? defaultValues.dateSession.split("T")[0]
        : "",
      price: defaultValues.price?.toString() ?? "",
      groupId: defaultValues.groupId ? defaultValues.groupId.toString() : "",
    });
  } else {
    setForm({
      type: 0,
      scheduledAt: "",
      price: "",
      groupId: "",
    });
  }
}, [defaultValues, open]);

const handleSubmit = async () => {
  if (!form.scheduledAt || !form.groupId) return;
  if (form.type === 0 && !form.price) return;

  const sessionData = {
    type: form.type,
    scheduledAt: new Date(form.scheduledAt).toISOString(),
    price: form.type === 1 ? undefined : parseFloat(form.price),
  };

  if (mode === "add") {
    await addSessionToGroup(parseInt(form.groupId), sessionData);
  } else if (defaultValues?.id) {
    await updateSession(defaultValues.id, { ...sessionData, scheduledAt: sessionData.scheduledAt });
  }

  setOpen(false);
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button className="rounded-full" variant="secondary">
            Add New Session <PlusIcon className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <EditButton />
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Session" : "Edit Session"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div>
            <Label>Session Type</Label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: parseInt(e.target.value) })
              }
              className="border rounded-md w-full px-2 py-1 text-sm"
            >
              <option value={0}>Paid Session</option>
              <option value={1}>Free Session</option>
            </select>
          </div>

          <div>
            <Label>Session Date</Label>
            <Input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Price (DZD)</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 1500"
              disabled={form.type === 1} // disable for free sessions
            />
          </div>

          <div>
            <Label>Group</Label>
            <select
              value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              className="border rounded-md w-full px-2 py-1 text-sm"
            >
              <option value="">Select group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
  <ConfirmDialog
    title={mode === "add" ? "Confirm New Session" : "Confirm Changes"}
    description={
      mode === "add"
        ? "Are you sure you want to add this new session?"
        : "Are you sure you want to save changes to this session?"
    }
    confirmText={mode === "add" ? "Add Session" : "Save Changes"}
    cancelText="Cancel"
    variant="green"
    triggerLabel={mode === "add" ? "Add Session" : "Save Changes"}
    onConfirm={handleSubmit}
  >
    <div className="text-sm text-gray-600 space-y-1">
      <p>
        <strong>Type:</strong> {form.type === 1 ? "Free Session" : "Paid Session"}
      </p>
      <p>
        <strong>Date:</strong> {form.scheduledAt || "Not selected"}
      </p>
      {form.type === 0 && (
        <p>
          <strong>Price:</strong> {form.price ? `${form.price} DZD` : "Not set"}
        </p>
      )}
      <p>
        <strong>Group:</strong>{" "}
        {groups.find((g) => g.id.toString() === form.groupId)?.name || "Not selected"}
      </p>
    </div>
  </ConfirmDialog>
</DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
