import { useEffect, useState, useMemo } from "react";
import { SearchInput } from "@/components/ui/search";
import TeachersTable from "./TeachersTable";
import { useTeacherStore } from "@/stores/teachersStore";


export default function DirectorTeachersSection() {
  const [search, setSearch] = useState("");

  const { teachers, fetchTeachers, loading, error } = useTeacherStore();

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.filter((teacher) =>
      teacher.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

  if (loading)
    return <p className="text-center py-4 text-gray-500">Loading teachers...</p>;

  if (error)
    return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Teachers</h2>

      <div className="flex justify-end gap-2 items-center">
        <SearchInput
          placeholder="Search teachers..."
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />
      </div>

      <TeachersTable data={filteredTeachers} />
    </div>
  );
}
