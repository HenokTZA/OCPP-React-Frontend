import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import {
  LayoutDashboard,
  History,
  Settings,
  FileText,
  Wrench,
  LogOut,
  X,
  ChevronRight,
  User,
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark } = useTheme();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
      active: location.pathname === "/",
    },
    {
      icon: History,
      label: "History",
      path: "/history",
      active: location.pathname === "/history",
    },
    {
      icon: Settings,
      label: "Manage",
      path: "/manage",
      active: location.pathname === "/manage",
    },
    {
      icon: FileText,
      label: "Reports",
      path: "/reports",
      active: location.pathname === "/reports",
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      active: location.pathname === "/profile",
    },
    {
      icon: Wrench,
      label: "Diagnose",
      path: "/diagnose",
      active: location.pathname === "/diagnose",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen flex flex-col z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-[#030a01] text-dark-text-primary bg-dark-bg-primary border-r border-gray-800"
            : "bg-gradient-to-b from-light-bg-primary to-light-bg-quaternary text-light-text-primary border-r border-light-border-secondary bg-white border-b border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 h-20 ${
            isDark
              ? "bg-[#020d00] border-b border-gray-800"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <div className="flex gap-2 items-center">
            <img src={logo} alt="Logo" className="w-10 object-contain" />
            <div className="flex flex-col items-start">
              <h1
                className={`text-heading-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}
              >
                OCPP Dashboard
              </h1>
              <p
                className={`text-caption-md ${
                  isDark
                    ? "text-dark-text-secondary"
                    : "text-light-text-secondary"
                }`}
              >
                Charge Point Management
              </p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? isDark
                        ? "bg-gradient-to-r from-[#155905] to-[#c9be4a] text-white"
                        : "bg-gradient-to-r from-[#2d8c07] to-[#ccbb00] text-white"
                      : isDark
                      ? "text-[#989E92] hover:bg-[#1a2f03] hover:text-white"
                      : "text-gray-600 hover:bg-[#afcca9] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.active && <ChevronRight className="w-4 h-4" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div
          className={`px-3 py-2 border-t ${
            isDark ? "border-[#213A04]" : "border-gray-200"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left ${
              isDark
                ? "text-[#989E92] hover:bg-red-800 hover:text-white"
                : "text-gray-600 hover:bg-red-800 hover:text-white"
            }`}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
