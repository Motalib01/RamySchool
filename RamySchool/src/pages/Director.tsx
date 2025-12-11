import Sidebar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";
import { Outlet } from "react-router-dom";

export default function Director() {
  return (
    <div className="h-screen flex">
      <Sidebar role="director" />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
