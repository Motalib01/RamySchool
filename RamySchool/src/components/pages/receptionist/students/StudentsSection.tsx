import { SearchInput } from "@/components/ui/search";
import { useEffect, useState, useMemo } from "react";
import StudentsTable from "./StudentTable";
import StudentsDialog from "./StudentPopUp";
import { useStudentsStore } from "@/stores/studentsStore";
import EnrollmentPopup from "./EnrollmentPopUp";
import { Button } from "@/components/ui/button";

export default function StudentSection() {
  const [search, setSearch] = useState("");
  const { students, fetchStudents, loading, error } = useStudentsStore();

  // control enrollment popup visibility
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((student) =>
      student.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  if (loading) return <p className="text-center text-muted-foreground">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Students</h2>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <StudentsDialog mode="add" />

          {/* Button to open the Enrollment popup */}
          <Button variant="default" onClick={() => setIsEnrollmentOpen(true)}>Enroll Student</Button>

          {/* Enrollment popup controlled via state */}
          <EnrollmentPopup
            open={isEnrollmentOpen}
            onOpenChange={(open) => setIsEnrollmentOpen(open)}
            onSuccess={() => {
              // refresh students (and/or any other store fetches you need)
              fetchStudents();
            }}
          />
        </div>

        <div className="gap-2 flex items-center">
          <SearchInput
            placeholder="Search students..."
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      <StudentsTable data={filteredStudents} />
    </div>
  );
}
