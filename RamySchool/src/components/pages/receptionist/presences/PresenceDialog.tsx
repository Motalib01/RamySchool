// PresenceDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/stores/sessionsStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type PresenceDialogProps = {
  student: {
    id: number;
    name: string;
  } | null;
  /**
   * teacher-session object (from fetchStudentSessionsForTeacher).
   * Must contain sessionId, date, type, etc.
   */
  session?: {
    sessionId: number;
    sessionNumber?: number;
    date?: string;
    type?: number;
    sessionType?: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (studentId: number, updatedSession: any) => void;
};

type AttendanceRecord = {
  attendanceId?: number | null;
  sessionId: number;
  sessionType?: number;
  type?: number; // 0 pending,1 present,2 absent
  studentId?: number;
};

export default function PresenceDialog({
  student,
  session,
  open,
  onOpenChange,
  onSaved,
}: PresenceDialogProps) {
  const { getStudentSessions, updateAttendanceState } = useSessionStore();

  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);
  const [value, setValue] = useState<1 | 2>(1); // 1 = present, 2 = absent
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("PresenceDialog props:", { student, session, open });
  }, [student, session, open]);

  // Hooks defined before any early return
  useEffect(() => {
    let cancelled = false;

    // bail early if dialog not open or missing required props
    if (!open || !student || !session) {
      setAttendanceRecord(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        // fetch all attendance records for the student
        const raw = await getStudentSessions(student.id);
        if (cancelled) return;
        const arr: AttendanceRecord[] = Array.isArray(raw) ? raw : [];

        // find the attendance that matches the clicked sessionId (if any)
        const match = arr.find((a) => Number(a.sessionId) === Number(session.sessionId)) ?? null;

        if (match) {
          setAttendanceRecord(match);
          // set initial radio value from the attendance type (1 present, 2 absent), default to present if pending
          setValue(match.type === 1 ? 1 : match.type === 2 ? 2 : 1);
        } else {
          // no attendance row exists yet for this session
          setAttendanceRecord({
            attendanceId: null,
            sessionId: session.sessionId,
            sessionType: session.sessionType,
            type: session.type ?? 0,
          });
          // default selection if pending -> Present
          setValue(session.type === 2 ? 2 : 1);
        }
      } catch (err) {
        console.error("PresenceDialog: failed to load student attendances", err);
        setAttendanceRecord(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, student, session, getStudentSessions]);

  // UI guard (safe because hooks run above)
  if (!open) return null;
  if (!student) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-sm text-muted-foreground">Student missing</div>
        </DialogContent>
      </Dialog>
    );
  }

  const canSave = !!(attendanceRecord && attendanceRecord.attendanceId);

  const handleSave = async () => {
    if (!attendanceRecord) return;
    if (!attendanceRecord.attendanceId) return; // no create endpoint available

    setSaving(true);
    try {
      await updateAttendanceState(attendanceRecord.attendanceId as number, value);

      const updated = {
        attendanceId: attendanceRecord.attendanceId,
        sessionId: attendanceRecord.sessionId,
        sessionType: attendanceRecord.sessionType,
        type: value,
        date: session?.date,
      };

      // notify parent for optimistic update
      if (onSaved && student) onSaved(student.id, updated);

      // update local record and close
      setAttendanceRecord(updated);
      onOpenChange(false);
    } catch (err) {
      console.error("PresenceDialog: update failed", err);
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = (t?: number) => (t === 0 ? "Pending" : t === 1 ? "Present" : t === 2 ? "Absent" : "—");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{student.name} — Set presence</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : attendanceRecord ? (
            <>
              <div className="mb-3 text-sm text-muted-foreground">
                Session #{attendanceRecord.sessionId} — {statusLabel(attendanceRecord.type)}
                {session?.date ? ` • ${new Date(session.date).toLocaleString()}` : ""}
              </div>

              <RadioGroup value={String(value)} onValueChange={(v) => setValue(Number(v) as 1 | 2)}>
                <div className="space-y-2">
                  <label className={cn("flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer")}>
                    <RadioGroupItem value="1" id="presence-present" />
                    <span className="ml-1">Present</span>
                  </label>

                  <label className={cn("flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer")}>
                    <RadioGroupItem value="2" id="presence-absent" />
                    <span className="ml-1">Absent</span>
                  </label>
                </div>
              </RadioGroup>

              {!attendanceRecord.attendanceId && (
                <div className="mt-3 text-sm text-muted-foreground">
                  No attendance record exists for this session (attendanceId missing). The backend must create an attendance record first to allow updates.
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">No data</div>
          )}
        </div>

        <DialogFooter>
          <div className="w-full flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave || saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
