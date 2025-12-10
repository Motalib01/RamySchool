import Sidebar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";
import { Outlet } from "react-router-dom";

export default function Director() {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />

      <div className="flex flex-1 gap-2 pt-40">
        <Sidebar role="director" />

        <main className="flex-1 px-10 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
