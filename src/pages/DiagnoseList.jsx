import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  AlertCircle,
  RefreshCw,
  Zap,
  Cpu,
  MapPin,
  Wrench,
  Filter,
  Plus,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DiagnoseList() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadChargePoints();
  }, []);

  const loadChargePoints = async () => {
    try {
      setErr(null);
      const data = await fetchJson("/charge-points/");
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      setErr(e.message || "Failed to load charge points");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadChargePoints();
  };

  const filtered = items.filter((cp) => {
    // Search filter
    if (q) {
      const s = q.toLowerCase();
      const matchesSearch =
        String(cp.id).toLowerCase().includes(s) ||
        (cp.name && cp.name.toLowerCase().includes(s)) ||
        (cp.serialNumber && cp.serialNumber.toLowerCase().includes(s)) ||
        (cp.location && cp.location.toLowerCase().includes(s));

      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && cp.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-500";
      case "charging":
        return "bg-amber-500";
      case "unavailable":
        return "bg-rose-500";
      case "faulted":
        return "bg-rose-500";
      case "offline":
        return "bg-neutral-500";
      default:
        return "bg-neutral-400";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Available", label: "Available" },
    { value: "Charging", label: "Charging" },
    { value: "Unavailable", label: "Unavailable" },
    { value: "Faulted", label: "Faulted" },
    { value: "Offline", label: "Offline" },
  ];

  const stats = {
    total: items.length,
    available: items.filter((cp) => cp.status === "Available").length,
    charging: items.filter((cp) => cp.status === "Charging").length,
    offline: items.filter((cp) => cp.status === "Offline" || !cp.status).length,
  };

  if (loading)
    return (
      <LoadingSpinner message="Loading charge points..." isDark={isDark} />
    );

  return (
    <DashboardLayout>
      <div className={`h-full p-6 space-y-6`}>
        <div className="w-full space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap
                  className={`w-5 h-5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Total
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                {stats.total}
              </p>
            </div>

            <div
              className={`p-5 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Available
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                {stats.available}
              </p>
            </div>

            <div
              className={`p-5 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Charging
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                {stats.charging}
              </p>
            </div>

            <div
              className={`p-5 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-neutral-500" />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  Offline
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                {stats.offline}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  }`}
                />
                <input
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDark
                      ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                      : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  placeholder="Search by name, ID, serial number, or location..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter
                    className={`w-5 h-5 ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-3 rounded-xl border ${
                      isDark
                        ? "bg-neutral-800 border-neutral-700 text-white"
                        : "bg-white border-neutral-200 text-neutral-900"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRefresh}
                  className={`p-3 rounded-xl ${
                    isDark
                      ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  } transition-colors`}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {err && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isDark
                  ? "bg-rose-900/20 text-rose-300"
                  : "bg-rose-50 text-rose-800"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{err}</p>
            </div>
          )}

          {/* Charge Points List */}
          <div className="grid gap-2">
            {filtered.map((cp) => (
              <Link
                key={cp.id}
                to={`/diagnose/${cp.id}`}
                className={`block px-5 py-3 rounded-xl border transition-all ${
                  isDark
                    ? "bg-[#0f0f0e] border-neutral-800 hover:border-green-800"
                    : "bg-white border-neutral-200 hover:border-emerald-500"
                } hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        isDark ? "bg-neutral-800" : "bg-neutral-100"
                      }`}
                    >
                      <Zap
                        className={`w-6 h-6 ${
                          isDark ? "text-green-700" : "text-green-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-1 ${
                          isDark ? "text-white" : "text-neutral-800"
                        }`}
                      >
                        {cp.name || `Charge Point ${cp.id}`}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4">
                        <span
                          className={`text-xs ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          ID: {cp.id}
                        </span>

                        {cp.serialNumber && (
                          <span
                            className={`text-xs ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            SN: {cp.serialNumber}
                          </span>
                        )}

                        {cp.connector_type && (
                          <span
                            className={`text-xs ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            {cp.connector_type}
                          </span>
                        )}
                      </div>

                      {cp.location && (
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin
                            className={`w-4 h-4 ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            {cp.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                        isDark ? "bg-opacity-20 text-white" : "text-neutral-800"
                      } ${getStatusColor(cp.status)}`}
                    >
                      {cp.status || "Unknown"}
                    </span>

                    <div className="flex items-center">
                      <Wrench
                        className={`w-5 h-5 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      />
                      <ChevronRight
                        className={`w-5 h-5 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {!err && filtered.length === 0 && (
            <div
              className={`text-center py-12 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <Zap
                className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                {items.length === 0
                  ? "No charge points found"
                  : "No matching charge points"}
              </h3>
              <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
                {items.length === 0
                  ? "Get started by adding your first charge point to the system."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {items.length === 0 && (
                <button
                  className={`mt-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isDark
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  } transition-colors`}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Charge Point
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
