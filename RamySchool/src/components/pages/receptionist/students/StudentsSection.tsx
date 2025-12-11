// import { Filter } from "@/components/ui/filter";
import { SearchInput } from "@/components/ui/search";
import { useEffect, useState, useMemo } from "react";
import StudentsTable from "./StudentTable";
import StudentsDialog from "./StudentPopUp";
import ManageEnrollmentDialog from "./ManageEnrollmentDialog";
import { useStudentsStore } from "@/stores/studentsStore";

// const studentFilters = [
//   { label: "All", value: "all" },
//   { label: "This Month", value: "month" },
//   { label: "This Week", value: "week" },
//   { label: "Today", value: "today" },
// ];

export default function StudentSection() {
  // const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { students, fetchStudents, loading, error } = useStudentsStore();

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
          <ManageEnrollmentDialog />
        </div>

        <div className="gap-2 flex items-center">
          <SearchInput
            placeholder="Search students..."
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
          {/* <Filter
            label="Period"
            options={studentFilters}
            value={filter}
            onChange={setFilter}
          /> */}
        </div>
      </div>

      <StudentsTable data={filteredStudents} />
    </div>
  );
}