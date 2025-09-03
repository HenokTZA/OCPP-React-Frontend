import { useEffect, useState } from "react";
import { fetchUserProfile, fetchDashboardData } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import DashboardLayout from "@/components/DashboardLayout";
import {
  TrendingUp,
  Zap,
  Clock,
  Settings,
  Target,
  Activity,
  DollarSign,
  BarChart3,
  AlertCircle,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import RecentSessions from "../components/RecentSessions";
import LoadingSpinner from "../components/LoadingSpinner";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");
const cpKey = (cp) => cp?.pk ?? cp?.id;

export default function Dashboard() {
  /* server-side data */
  const [me, setMe] = useState(null);
  const [cps, setCps] = useState(null);
  const [sessions, setSes] = useState(null);

  /* login + first fetch */
  const { logout } = useAuth();
  const { isDark } = useTheme();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);

  // helper
  const money = (n) => {
    const amount = Number(n || 0);
    // Format with 2 decimal places and comma separators for thousands
    return `€${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  useEffect(() => {
    fetchUserProfile()
      .then(setMe)
      .catch(() => logout());
  }, [logout]);

  /* load + poll every 5 s */
  useEffect(() => {
    if (!me?.tenant_ws) return;

    const load = () =>
      fetchDashboardData().then(
        ({ chargePoints, sessions, stats, revenue }) => {
          setCps(chargePoints);
          setSes(sessions);
          setStats(stats);
          setRevenue(revenue);
        }
      );

    load();
    const t = setInterval(load, 5_000);
    return () => clearInterval(t);
  }, [me]);

  if (!me)
    return <LoadingSpinner message="Loading user profile..." isDark={isDark} />;

  if (!me.tenant_ws)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div
            className={`p-8 rounded-2xl text-center max-w-md w-full ${
              isDark ? "bg-neutral-900" : "bg-white shadow-md"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full ${
                  isDark
                    ? "bg-amber-500/20 text-amber-500"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                <AlertCircle size={24} />
              </div>
            </div>
            <h2
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              No Tenant Found
            </h2>
            <p
              className={`text-sm ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              You don't have a tenant workspace yet. Please contact your
              administrator.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );

  if (!cps || !sessions)
    return (
      <LoadingSpinner message="Loading dashboard data..." isDark={isDark} />
    );

  // —— Revenue totals from backend ——
  const lifetimeRevenue = revenue?.lifetime ?? 0;
  const monthRevenue = revenue?.month ?? 0;
  const monthLabel =
    revenue?.month_label ??
    new Date().toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="w-full p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Total Revenue Card */}
          <div
            className={`rounded-lg p-5 ${
              isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Total Revenue
              </h3>
              <div
                className={`p-2 rounded-lg ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <DollarSign size={16} />
              </div>
            </div>
            <div
              className={`text-2xl font-semibold mb-1 ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {money(lifetimeRevenue)}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-neutral-500" : "text-neutral-600"
              }`}
            >
              Lifetime earnings
            </p>
          </div>

          {/* Monthly Revenue Card */}
          <div
            className={`rounded-lg p-5 ${
              isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Monthly Revenue
              </h3>
              <div
                className={`p-2 rounded-lg ${
                  isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <TrendingUp size={16} />
              </div>
            </div>
            <div
              className={`text-2xl font-semibold mb-1 ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {money(monthRevenue)}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-neutral-500" : "text-neutral-600"
              }`}
            >
              {monthLabel}
            </p>
          </div>

          {/* Stations Summary Card */}
          <div
            className={`rounded-lg p-5 ${
              isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Charge Points
              </h3>
              <div
                className={`p-2 rounded-lg ${
                  isDark
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <Zap size={16} />
              </div>
            </div>
            <div
              className={`text-2xl font-semibold mb-1 ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {cps.length}
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-neutral-500" : "text-neutral-600"
              }`}
            >
              Total stations
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview */}
          <div
            className={`lg:col-span-2 rounded-2xl p-6 ${
              isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                Charge Point Status
              </h2>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  isDark
                    ? "bg-neutral-800 text-neutral-400"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                LIVE
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                const t = stats?.totals || {};
                const statusItems = [
                  {
                    label: "Available",
                    value: t.available,
                    icon: Zap,
                    color: "text-emerald-500",
                    bgColor: "bg-emerald-500/10",
                  },
                  {
                    label: "Charging",
                    value: t.charging,
                    icon: Activity,
                    color: "text-blue-500",
                    bgColor: "bg-blue-500/10",
                  },
                  {
                    label: "Occupied",
                    value: t.occupied,
                    icon: Clock,
                    color: "text-amber-500",
                    bgColor: "bg-amber-500/10",
                  },
                  {
                    label: "Unavailable",
                    value: t.unavailable,
                    icon: Settings,
                    color: "text-rose-500",
                    bgColor: "bg-rose-500/10",
                  },
                  {
                    label: "Preparing",
                    value: t.preparing,
                    icon: Target,
                    color: "text-purple-500",
                    bgColor: "bg-purple-500/10",
                  },
                  {
                    label: "Other",
                    value: t.other,
                    icon: BarChart3,
                    color: "text-neutral-500",
                    bgColor: "bg-neutral-500/10",
                  },
                ];

                return statusItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        isDark
                          ? "bg-neutral-800 hover:bg-neutral-750"
                          : "bg-neutral-50 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg mr-3 ${item.bgColor} ${item.color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-medium truncate ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            {item.label}
                          </div>
                          <div
                            className={`text-xl font-semibold ${
                              isDark ? "text-white" : "text-neutral-800"
                            }`}
                          >
                            {item.value ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Revenue Summary */}
          <div
            className={`rounded-lg p-6 ${
              isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                Revenue Summary
              </h2>
              <div className={`p-2 rounded-lg bg-blue-500/10 text-blue-500`}>
                <DollarSign size={16} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div
                  className={`text-xs font-medium mb-2 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  This Month ({monthLabel})
                </div>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-neutral-800"
                  }`}
                >
                  {money(monthRevenue)}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-xs font-medium text-emerald-500">
                    +12.5% from last month
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-neutral-700/30">
                <div
                  className={`text-xs font-medium mb-2 ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Average Session Value
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-neutral-800"
                  }`}
                >
                  {money(monthRevenue / (sessions.length || 1))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <RecentSessions sessions={sessions} cps={cps} cpKey={cpKey} fmt={fmt} />
      </div>
    </DashboardLayout>
  );
}
