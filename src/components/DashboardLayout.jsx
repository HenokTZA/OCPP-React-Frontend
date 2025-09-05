import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useSidebar } from "@/lib/sidebarContext";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import ThemeToggle from "./ThemeToggle";

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { isSidebarOpen, isCollapsed, toggleSidebar, toggleCollapse } = useSidebar();

  return (
    <div
      className={`flex h-screen ${
        isDark
          ? "bg-gradient-to-br from-zinc-900 to-neutral-900"
          : "bg-gray-100"
      }`}
    >
      <ThemeToggle />
      <Sidebar
        toggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <TopHeader toggleSidebar={toggleSidebar} user={user} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-2">
          <div className={`h-full ${isDark ? "text-white" : "text-gray-900"}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
