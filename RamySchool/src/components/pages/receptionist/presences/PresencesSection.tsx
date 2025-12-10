import { useEffect, useState, useMemo } from "react";
import PresencesTable from "./PresencesTable";
import { useStudentsStore } from "@/stores/studentsStore";
import { useSessionStore } from "@/stores/sessionsStore";
import { SearchInput } from "@/components/ui/search";

export default function PresencesSection() {
  const [search, setSearch] = useState("");

  const {
    students,
    fetchStudents,
    loading: studentsLoading,
    error: studentsError,
  } = useStudentsStore();

  const {
    sessions,
    fetchSessions,
    loading: sessionsLoading,
    error: sessionsError,
  } = useSessionStore();

  
  useEffect(() => {
    fetchStudents();
    fetchSessions();
  }, [fetchStudents, fetchSessions]);

  const loading = studentsLoading || sessionsLoading;
  const error = studentsError || sessionsError;

  
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Presences</h2>

      
      <div className="flex justify-between items-center">
        <div></div>
        <SearchInput
          placeholder="Search students..."
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />
      </div>

      {loading && <p className="text-gray-500">Loading presences...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredStudents.length > 0 && sessions.length > 0 && (
        <PresencesTable data={filteredStudents} />
      )}

      {!loading && !error && filteredStudents.length === 0 && (
        <p className="text-gray-500">No matching students found.</p>
      )}

      {!loading && !error && students.length > 0 && sessions.length === 0 && (
        <p className="text-gray-500">No sessions found.</p>
      )}
    </div>
  );
}
