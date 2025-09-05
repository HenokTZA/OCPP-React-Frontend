import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useSidebar } from "@/lib/sidebarContext";
import {
  Map,
  MapPin,
  User,
  Clock,
  LogOut,
  X,
  ChevronRight,
  PanelRightOpen, // For expanded state
  PanelRightClose,
  MenuIcon,
  ChevronLeft, // For collapsed state
} from "lucide-react";
import logo from "@/assets/logo.png";

export default function UserSidebar({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const { isCollapsed, toggleCollapse } = useSidebar();

  async function handleLogout() {
    try {
      await logout?.();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  const navItems = [
    {
      icon: Map,
      label: "Map",
      path: "map",
      active: location.pathname === "/app/map",
    },
    {
      icon: MapPin,
      label: "Nearby",
      path: "nearby",
      active: location.pathname === "/app/nearby",
    },
    {
      icon: User,
      label: "Profile",
      path: "profile",
      active: location.pathname === "/app/profile",
    },
    {
      icon: Clock,
      label: "Timeline",
      path: "timeline",
      active: location.pathname === "/app/timeline",
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
        className={`fixed lg:relative h-screen flex flex-col z-30 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isDark
            ? "bg-[#030a01] text-dark-text-primary bg-dark-bg-primary border-r border-gray-800"
            : "bg-gradient-to-b from-light-bg-primary to-light-bg-quaternary text-light-text-primary border-r border-light-border-secondary bg-white border-b border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 h-20 relative ${
            isDark
              ? "bg-[#020d00] border-b border-gray-800"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <div
            className={`flex gap-2 items-center ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <img src={logo} alt="Logo" className="w-10 object-contain" />
            {!isCollapsed && (
              <div className="flex flex-col items-start">
                <h1
                  className={`text-heading-sm ${
                    isDark
                      ? "text-dark-text-primary"
                      : "text-light-text-primary"
                  }`}
                >
                  EV Dashboard
                </h1>
                <p
                  className={`text-caption-md ${
                    isDark
                      ? "text-dark-text-secondary"
                      : "text-light-text-secondary"
                  }`}
                >
                  Charging Station Finder
                </p>
              </div>
            )}
          </div>
          
          {/* Collapse/Expand button - positioned at the right edge */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-1.5 items-center justify-center rounded-md w-6 h-6 z-[1002]"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              top: "30px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}
          >
            <div className={`
              flex items-center justify-center rounded-md w-6 h-6
              ${isDark 
                ? "bg-[#020d00] border border-gray-700 text-white" 
                : "bg-white border border-gray-300 text-gray-700"
              }
            `}>
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </div>
          </button>
          
          {/* Mobile close button */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <div className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
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
                  {!isCollapsed && item.label}
                </div>
                {item.active && !isCollapsed && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div
          className={`mt-auto px-3 py-2 border-t ${
            isDark ? "border-[#213A04]" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left ${
              isDark
                ? "text-[#989E92] hover:bg-red-700 hover:text-white"
                : "text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}