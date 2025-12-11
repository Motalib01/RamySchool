import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresenceStore } from "@/stores/presencesStore";
import { PresenceResponse } from "@/services/presencesService";

interface PresenceUpdateDialogProps {
  presence: PresenceResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: 0, label: "Pending", color: "text-yellow-600" },
  { value: 1, label: "Present", color: "text-green-600" },
  { value: 2, label: "Absent", color: "text-red-600" },
];

export default function PresenceUpdateDialog({
  presence,
  open,
  onOpenChange,
}: PresenceUpdateDialogProps) {
  const [status, setStatus] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { updatePresence } = usePresenceStore();

  // Update status when presence changes
  useEffect(() => {
    if (presence) {
      setStatus(presence.presenceStatus);
    }
  }, [presence]);

  const handleSubmit = async () => {
    if (!presence) return;

    setLoading(true);
    try {
      // Use the presence store to update directly
      await updatePresence(presence.id, {
        studentId: 0, // Not needed for update
        sessionId: 0, // Not needed for update
        status: status,
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating presence:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!presence) return null;

  const currentStatus = statusOptions.find(opt => opt.value === presence.presenceStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Presence</DialogTitle>
          <DialogDescription>
            Change the attendance status for this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Student:</strong> {presence.studentName}</p>
            <p><strong>Group:</strong> {presence.groupName}</p>
            <p><strong>Session Date:</strong> {presence.sessionDate}</p>
            <p>
              <strong>Current Status:</strong>{" "}
              <span className={currentStatus?.color}>
                {currentStatus?.label || "Unknown"}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">New Status</label>
            <Select
              value={String(status)}
              onValueChange={(val) => setStatus(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}