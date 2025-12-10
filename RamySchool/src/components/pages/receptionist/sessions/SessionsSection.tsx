import { useEffect, } from "react";
import SessionsTable from "./SessionsTable";
import SessionsDialog from "./SessionPopUp";
import { useSessionStore } from "@/stores/sessionsStore";


export default function SessionsSection() {
  const { sessions, fetchSessions, loading, error } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Sessions</h2>

      <div className="flex justify-between items-center">
        <SessionsDialog mode="add" />
      </div>

      {loading && <p className="text-sm text-gray-500">Loading sessions...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && <SessionsTable data={sessions} />}
    </div>
  );
}
