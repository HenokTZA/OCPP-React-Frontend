import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useSidebar } from "@/lib/sidebarContext";
import UserSidebar from "./UserSidebar";
import TopHeader from "./TopHeader";
import ThemeToggle from "./ThemeToggle";

export default function UserDashboardLayout({ children }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div
      className={`flex h-screen ${
        isDark
          ? "bg-gradient-to-br from-zinc-900 to-neutral-900"
          : "bg-gray-100"
      }`}
    >
      <ThemeToggle />
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col lg:ml-0">
        <TopHeader toggleSidebar={toggleSidebar} user={user} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className={`h-full ${isDark ? "text-white" : "text-gray-900"}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
