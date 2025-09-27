import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import {
  Zap,
  Clock,
  Calendar,
  DollarSign,
  Battery,
  AlertCircle,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import UserLoadingSpinner from "../../components/UserLoadingSpinner";

export default function TimelinePage() {
  const { isDark } = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await fetchJson("/sessions/");
      setRows(data.results || []);
    } catch (err) {
      setError("Failed to load charging sessions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return "—";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatus = (start, end) => {
    if (!start) return "pending";
    if (!end) return "active";
    return "completed";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "completed":
        return "bg-blue-500";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-neutral-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <UserLoadingSpinner
        message="Loading charging sessions..."
        isDark={isDark}
      />
    );
  }

  return (
    <div className={`h-full p-6 space-y-6`}>
      <div className="w-full space-y-6">
        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={fetchTransactions}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            } shadow-sm`}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              isDark
                ? "bg-rose-900/20 text-rose-300"
                : "bg-rose-50 text-rose-800"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Total Sessions
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {rows.length}
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Battery
                className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Total Energy
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {rows
                .reduce(
                  (total, row) => total + Number(row.kWh || row.kwh || 0),
                  0
                )
                .toFixed(1)}{" "}
              kWh
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign
                className={`w-5 h-5 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Total Spent
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {rows
                .reduce((total, row) => total + Number(row.total || 0), 0)
                .toFixed(2)}{" "}
              €
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className={`w-5 h-5 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Avg. Duration
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {rows.filter((r) => r.Started && r.Ended).length > 0
                ? formatDuration(
                    rows[0]?.Started || rows[0]?.start_time,
                    rows[0]?.Ended || rows[0]?.stop_time
                  )
                : "—"}
            </p>
          </div>
        </div>

        {/* Sessions List */}
        {rows.length === 0 ? (
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
              No charging sessions yet
            </h3>
            <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Your charging history will appear here after your first session.
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? "border-neutral-800" : "border-neutral-200"
                    }`}
                  >
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Status
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Charge Point
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Duration
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Energy
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Cost
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Date
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {rows.map((r, i) => {
                    const status = getStatus(
                      r.Started || r.start_time,
                      r.Ended || r.stop_time
                    );
                    const energy = Number(r.kWh ?? r.kwh ?? 0);

                    return (
                      <tr
                        key={i}
                        className={`transition-colors ${
                          isDark
                            ? "hover:bg-neutral-800"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-opacity-20 text-white"
                                : "text-neutral-800"
                            } ${getStatusColor(status)}`}
                          >
                            {getStatusText(status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin
                              className={`w-4 h-4 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-white" : "text-neutral-800"
                              }
                            >
                              {r.cp || "Unknown"}
                            </span>
                          </div>
                          {r.connector_id && (
                            <div
                              className={`text-xs ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            >
                              Connector {r.connector_id}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock
                              className={`w-4 h-4 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-white" : "text-neutral-800"
                              }
                            >
                              {formatDuration(
                                r.Started || r.start_time,
                                r.Ended || r.stop_time
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Battery
                              className={`w-4 h-4 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-white" : "text-neutral-800"
                              }
                            >
                              {energy.toFixed(3)} kWh
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <DollarSign
                              className={`w-4 h-4 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-white" : "text-neutral-800"
                              }
                            >
                              {r.total
                                ? `${Number(r.total).toFixed(2)} €`
                                : "—"}
                            </span>
                          </div>
                          {r.price_kwh && (
                            <div
                              className={`text-xs ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            >
                              @ {r.price_kwh} €/kWh
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className={`w-4 h-4 ${
                                isDark ? "text-neutral-400" : "text-neutral-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-white" : "text-neutral-800"
                              }
                            >
                              {formatDate(r.Started || r.start_time)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
