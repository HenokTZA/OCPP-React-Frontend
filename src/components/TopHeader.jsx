import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Menu, ChevronDown, Globe, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function TopHeader({ toggleSidebar, user }) {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const languages = [{ code: "en", name: "English" }];

  async function handleLogout() {
    try {
      await logout?.();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <header
      className={`h-20 sticky top-0 z-[1001] ${
        isDark
          ? "bg-[#020d00] border-b border-gray-800"
          : "bg-light-bg-primary border-b border-light-border-secondary"
      } shadow-sm`}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 h-full">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-1.5 rounded-md mr-3 ${
              isDark
                ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-dark-text-primary" : "text-light-text-primary"
              }`}
            >
              Hello{user?.username ? `, ${user.username}` : ""}! 👋
            </h2>
            <p
              className={`text-sm ${
                isDark
                  ? "text-dark-text-secondary"
                  : "text-light-text-secondary"
              }`}
            >
              Welcome back!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pr-12">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                isDark
                  ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isLanguageOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 z-20 ${
                  isDark
                    ? "bg-dark-bg-secondary border border-dark-border-secondary"
                    : "bg-white border border-gray-200"
                }`}
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setIsLanguageOpen(false)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isDark
                        ? "text-dark-text-primary hover:bg-dark-bg-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isDark
                  ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-r from-[#539C06] to-[#D7EB57] text-black"
                    : "bg-gradient-to-r from-[#539C06] to-[#6BB00F] text-white"
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left">
                <p
                  className={`text-sm font-medium ${
                    isDark
                      ? "text-dark-text-primary"
                      : "text-light-text-primary"
                  }`}
                >
                  {user?.username || "User"}
                </p>
                <p
                  className={`text-xs ${
                    isDark
                      ? "text-dark-text-secondary"
                      : "text-light-text-secondary"
                  }`}
                >
                  {user?.role || "Admin"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 ${
                  isDark
                    ? "bg-[#0f0f0e] border border-zinc-800"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Link
                  to={user?.role === "user" ? `/app/profile` : `/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className={`block px-4 py-2 text-sm ${
                    isDark
                      ? "text-dark-text-primary hover:bg-dark-bg-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Your Profile
                </Link>
                <div
                  className={`border-t my-1 ${
                    isDark ? "border-dark-border-secondary" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    isDark
                      ? "text-dark-text-primary hover:bg-dark-bg-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
