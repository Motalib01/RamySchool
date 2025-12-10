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
  { label: "Teachers Revenue", icon: PersonStanding, to: "/director/teachers" },
  { label: "Log Out", icon: ArrowRight },
]

const receptionistMenu: MenuItem[] = [
  { label: "Teachers", icon: PersonStanding, to: "/receptionist/teachers" },
  { label: "Students", icon: Users, to: "/receptionist/students" },
  { label: "Sessions", icon: BookOpen, to: "/receptionist/sessions" },
  { label: "Groups", icon: Layers3, to: "/receptionist/groups" },
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
        className="md:hidden p-3 fixed top-2 left-4 z-50 bg-white rounded shadow"
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
        className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 w-64 transform transition-transform
        md:relative md:translate-x-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ul className="flex flex-col mt-10 md:mt-0">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            if (item.label === "Log Out") {
              return (
                <li key={idx}>
                  <button
                    onClick={() => setIsLogoutOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              )
            }
            return (
              <NavLink
                key={idx}
                to={item.to!}
                onClick={() => setIsMobileOpen(false)} // close menu on mobile after click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-gray-200 font-medium text-gray-900"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            )
          })}
        </ul>

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
