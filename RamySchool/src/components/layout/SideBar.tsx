import {
  PersonStanding,
  Square,
  Users,
  BookOpen,
  Layers3,
  CalendarCheck,
  ArrowRight,
  Menu,
  X,
  DollarSign,
} from "lucide-react"
import { FC, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import LogoutDialog from "../pages/authentication/LogOut"
import { useAuthStore } from "@/stores/authStore"

type Role = "director" | "receptionist"

type MenuItem = {
  label: string
  icon: FC<React.SVGProps<SVGSVGElement>>
  to?: string
}

const directorMenu: MenuItem[] = [
  { label: "Dashboard", icon: Square, to: "/director/dashboard" },
  { label: "Teachers Revenue", icon: DollarSign, to: "/director/teachers" },
  { label: "Log Out", icon: ArrowRight },
]

const receptionistMenu: MenuItem[] = [
  { label: "Teachers", icon: PersonStanding, to: "/receptionist/teachers" },
  { label: "Students", icon: Users, to: "/receptionist/students" },
  { label: "Groups", icon: Layers3, to: "/receptionist/groups" },
  { label: "Sessions", icon: BookOpen, to: "/receptionist/sessions" },
  { label: "Presences", icon: CalendarCheck, to: "/receptionist/presences" },
  { label: "Log Out", icon: ArrowRight },
]

export default function Sidebar({ role }: { role: Role }) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const menuItems = role === "director" ? directorMenu : receptionistMenu
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity md:hidden ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl z-50 w-64 transform transition-transform
        md:relative md:translate-x-0 md:h-screen md:shadow-none
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">RamySchool</h1>
          <p className="text-slate-400 text-sm mt-1">Management System</p>
        </div>

        <nav className="flex flex-col py-6 space-y-2 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              if (item.label === "Log Out") {
                return (
                  <li key={idx} className="px-3">
                    <button
                      onClick={() => setIsLogoutOpen(true)}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-red-600/20 transition-all duration-200 text-red-400 hover:text-red-300 mt-auto"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              }
              return (
                <li key={idx} className="px-3">
                  <NavLink
                    to={item.to!}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {isLogoutOpen && (
          <LogoutDialog
            isOpen={isLogoutOpen}
            onClose={() => setIsLogoutOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </>
  )
}
