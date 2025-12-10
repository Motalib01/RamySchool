import Sidebar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";
import { Outlet } from "react-router-dom";

export default function Receptionist() {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />

      <div className="flex flex-1 pt-40">
        <Sidebar role="receptionist" />

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
