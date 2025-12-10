
import { SearchInput } from "@/components/ui/search";
import { useEffect, useState, useMemo } from "react";
import GroupsTable from "./GroupsTable";
import GroupDialog from "./GroupPopUp";
import { useGroupStore } from "@/stores/groupStore";


export default function GroupsSection() {
  const [search, setSearch] = useState("");
  const { groups, fetchGroups, loading, error } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    return groups.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  if (loading) return <p className="text-center mt-10">Loading groups...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Groups</h2>

      <div className="flex justify-between items-center">
        <GroupDialog mode="add" />
        <div className="gap-2 flex items-center">
          <SearchInput
            placeholder="Search groups..."
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />

        </div>
      </div>

      <GroupsTable data={filteredGroups} />
    </div>
  );
}
