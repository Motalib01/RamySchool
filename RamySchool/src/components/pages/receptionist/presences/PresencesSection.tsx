import { useEffect, useState, useMemo } from "react";
import PresencesTable from "./PresencesTable";
import { usePresenceStore } from "@/stores/presencesStore";
import { SearchInput } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EnrollmentPopup from "@/components/pages/receptionist/enrollments/EnrollmentPopup";

export default function PresencesSection() {
  const [search, setSearch] = useState("");
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);

  const {
    presences,
    fetchPresences,
    loading,
    error,
  } = usePresenceStore();

  useEffect(() => {
    fetchPresences();
  }, [fetchPresences]);

  const filteredPresences = useMemo(() => {
    if (!presences) return [];
    return presences.filter((p) =>
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.groupName.toLowerCase().includes(search.toLowerCase())
    );
  }, [presences, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Presences</h1>
          <p className="text-gray-600 mt-1">Manage student attendance and enrollments</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="Search students or groups..."
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            className="w-80"
          />
          <Button onClick={() => setEnrollmentOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Enroll Student
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading presences...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && filteredPresences.length > 0 && (
        <PresencesTable data={filteredPresences} />
      )}

      {!loading && !error && filteredPresences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No presences found</p>
          <p className="text-gray-400 text-sm mt-2">Try enrolling students in groups to see their attendance</p>
        </div>
      )}

      <EnrollmentPopup
        open={enrollmentOpen}
        onOpenChange={setEnrollmentOpen}
        onSuccess={() => fetchPresences()}
      />
    </div>
  );
}
