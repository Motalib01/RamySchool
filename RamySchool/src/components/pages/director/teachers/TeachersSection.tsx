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

  const normalizedTeachers = useMemo(() => {
    if (!teachers) return [];
    return teachers.map((t) => ({
      ...t,
      groups: (t.groups || []).map((g) => ({
        ...g,
        students: (g.students || []).map((s) => ({
          ...s,
          presences: (s.presences || []).map((p: any) => ({
            ...(p || {}),
            isPresent: (p && typeof p.isPresent !== "undefined") ? p.isPresent : false,
          })),
        })),
      })),
    }));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    if (!normalizedTeachers) return [];
    return normalizedTeachers.filter((teacher) =>
      teacher.fullName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [normalizedTeachers, search]);

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
