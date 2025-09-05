import { useAuth } from "@/lib/auth";
import {
  User,
  Mail,
  Key,
  Phone,
  Edit3,
  Shield,
  Calendar,
  MapPin,
  Building,
  BadgeCheck,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import DashboardLayout from "../components/DashboardLayout";

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  if (!user) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isDark ? "bg-[#0f0f0e]" : "bg-neutral-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 ${
                isDark ? "bg-neutral-800" : "bg-neutral-200"
              }`}
            ></div>
            <div
              className={`h-4 w-32 mx-auto rounded ${
                isDark ? "bg-neutral-800" : "bg-neutral-200"
              } mb-2`}
            ></div>
            <div
              className={`h-3 w-24 mx-auto rounded ${
                isDark ? "bg-neutral-800" : "bg-neutral-200"
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    (user.full_name || "").trim() ||
    [user.first_name, user.last_name].filter(Boolean).join(" ").trim();

  const phone = (user.phone || user.phone_number || "").trim();
  const joinDate = user.date_joined || user.created_at;

  const InfoCard = ({ icon: Icon, title, value, className = "" }) => (
    <div
      className={`p-5 rounded-xl ${
        isDark ? "bg-[#0f0f0e]" : "bg-white"
      } shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon
          className={`w-5 h-5 ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {title}
        </span>
      </div>
      <p
        className={`text-lg font-semibold ${
          isDark ? "text-white" : "text-neutral-800"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );

  const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-center gap-4 py-4 ${className}`}>
      <div
        className={`p-2.5 rounded-xl ${
          isDark ? "bg-neutral-800" : "bg-neutral-100"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        />
      </div>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {label}
        </p>
        <p
          className={`font-medium ${
            isDark ? "text-white" : "text-neutral-800"
          }`}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className={`h-full p-6 space-y-6`}>
        <div className="w-full space-y-6">
          {/* Profile Overview */}
          <div
            className={`rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-[#2d8c07] to-[#ccbb00]`}
                >
                  <User className="w-10 h-10 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-neutral-800"
                      }`}
                    >
                      {fullName || user.username || "User"}
                    </h2>
                    {user.is_verified && (
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <p
                    className={`text-sm mb-3 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {user.email || "No email provided"}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {user.role && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                          isDark
                            ? "bg-emerald-900/20 text-emerald-300"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    )}

                    {joinDate && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                          isDark
                            ? "bg-blue-900/20 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        Member since {new Date(joinDate).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={Shield} title="Account Role" value={user.role} />
            <InfoCard
              icon={Calendar}
              title="Member Since"
              value={joinDate ? new Date(joinDate).toLocaleDateString() : "—"}
            />
            <InfoCard
              icon={BadgeCheck}
              title="Status"
              value={true ? "Active" : "Inactive"}
            />
          </div>

          {/* Detailed Information */}
          <div
            className={`rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-6">
              <h3
                className={`text-lg font-semibold mb-6 ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                Account Details
              </h3>

              <div className="space-y-1">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={fullName}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                />

                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={user.email}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                />

                <InfoRow
                  icon={Key}
                  label="Username"
                  value={user.username}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                />

                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={phone}
                  className="border-b border-neutral-200 dark:border-neutral-800"
                />

                <InfoRow icon={Shield} label="User ID" value={user.id} />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          {(user.address || user.company || user.department) && (
            <div
              className={`rounded-xl ${
                isDark ? "bg-neutral-900" : "bg-white"
              } shadow-sm`}
            >
              <div className="p-6">
                <h3
                  className={`text-lg font-semibold mb-6 ${
                    isDark ? "text-white" : "text-neutral-800"
                  }`}
                >
                  Additional Information
                </h3>

                <div className="space-y-1">
                  {user.address && (
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={user.address}
                      className="border-b border-neutral-200 dark:border-neutral-800"
                    />
                  )}

                  {user.company && (
                    <InfoRow
                      icon={Building}
                      label="Company"
                      value={user.company}
                      className="border-b border-neutral-200 dark:border-neutral-800"
                    />
                  )}

                  {user.department && (
                    <InfoRow
                      icon={User}
                      label="Department"
                      value={user.department}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
