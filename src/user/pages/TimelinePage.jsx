import { useEffect, useMemo, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import UserLoadingSpinner from "../../components/UserLoadingSpinner";

export default function TimelinePage() {
  const { isDark } = useTheme();

  // auth / role
  const [me, setMe] = useState(null);

  // data
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(null);

  // ui
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // pagination (DRF is 1-based)
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const isSuperAdmin = useMemo(() => {
    if (!me) return false;
    // adjust to your actual flag/role field from /api/me/
    // e.g. me.role === 'super_admin' or me.is_superuser === true
    return !!(me.is_superuser || me.role === "super_admin");
  }, [me]);

  async function loadMe() {
    try {
      const data = await fetchJson("/me/");
      setMe(data);
    } catch (err) {
      console.error("Failed to load /me:", err);
      // allow page to still try fetching (backend will still scope)
    }
  }

  async function loadSessions(signal) {
    try {
      setRefreshing(true);
      setError(null);

      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });

      // Normal user wants only his/her sessions:
      // we request ?mine=1 and let backend do the safe filtering
      if (!isSuperAdmin) {
        qs.set("mine", "1");
      }

      const data = await fetchJson(`/sessions/?${qs.toString()}`, { signal });
      setRows(data.results || []);
      setCount(data.count ?? null);
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Error fetching transactions:", err);
      setError("Failed to load charging sessions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      await loadMe();
      await loadSessions(abort.signal);
    })();
    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // re-run on page change

  const totalPages = useMemo(() => {
    if (!count) return null;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [count]);

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : rows.length === pageSize;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return "—";
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return "—";
    const ms = e - s;
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
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

  const totalEnergy = useMemo(
    () =>
      (rows || []).reduce(
        (acc, r) => acc + (Number(r.kWh ?? r.kwh) || 0),
        0
      ),
    [rows]
  );

  const totalSpent = useMemo(
    () =>
      (rows || []).reduce(
        (acc, r) => acc + (Number(r.total) || 0),
        0
      ),
    [rows]
  );

  if (loading) {
    return (
      <UserLoadingSpinner message="Loading charging sessions..." isDark={isDark} />
    );
  }

  return (
    <div className="h-full p-6 space-y-6">
      <div className="w-full space-y-6">
        {/* Header / Refresh + Pager */}
        <div className="flex items-center justify-between gap-3">
          <div className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            {isSuperAdmin ? "Viewing your tenant’s sessions" : "Viewing your sessions"}
            {typeof count === "number" && (
              <> • {count} total</>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 rounded-xl px-1 py-1 ${
                isDark ? "bg-neutral-900" : "bg-neutral-100"
              }`}
            >
              <button
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`p-2 rounded-lg disabled:opacity-50 ${
                  isDark ? "hover:bg-neutral-800" : "hover:bg-white"
                }`}
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={`px-2 text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                Page {page}{totalPages ? ` / ${totalPages}` : ""}
              </span>
              <button
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
                className={`p-2 rounded-lg disabled:opacity-50 ${
                  isDark ? "hover:bg-neutral-800" : "hover:bg-white"
                }`}
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => loadSessions()}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isDark
                  ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              } shadow-sm`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              isDark ? "bg-rose-900/20 text-rose-300" : "bg-rose-50 text-rose-800"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-5 rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Total Sessions (page)
              </span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-800"}`}>
              {rows.length}
            </p>
          </div>

          <div className={`p-5 rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Battery className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Energy (page)
              </span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-800"}`}>
              {totalEnergy.toFixed(3)} kWh
            </p>
          </div>

          <div className={`p-5 rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`w-5 h-5 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Spent (page)
              </span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-800"}`}>
              €{totalSpent.toFixed(2)}
            </p>
          </div>

          <div className={`p-5 rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Avg. Duration (row 1)
              </span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-neutral-800"}`}>
              {rows.filter((r) => r.Started && r.Ended).length > 0
                ? formatDuration(rows[0]?.Started || rows[0]?.start_time, rows[0]?.Ended || rows[0]?.stop_time)
                : "—"}
            </p>
          </div>
        </div>

        {/* Sessions Table */}
        {rows.length === 0 ? (
          <div className={`text-center py-12 rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <Zap className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-neutral-800"}`}>
              No charging sessions yet
            </h3>
            <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Your charging history will appear here after your first session.
            </p>
          </div>
        ) : (
          <div className={`rounded-xl ${isDark ? "bg-[#0f0f0e]" : "bg-white"} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                    {["Status", "Charge Point", "Duration", "Energy", "Cost", "Date"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {rows.map((r, i) => {
                    const status = getStatus(r.Started || r.start_time, r.Ended || r.stop_time);
                    const energy = Number(r.kWh ?? r.kwh ?? 0);
                    const cpLabel = r.cp?.name || r.cp?.code || r.cp || r.cp_id || "Unknown";
                    return (
                      <tr
                        key={i}
                        className={`transition-colors ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                              isDark ? "bg-opacity-20 text-white" : "text-neutral-800"
                            } ${getStatusColor(status)}`}
                          >
                            {getStatusText(status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                            <span className={isDark ? "text-white" : "text-neutral-800"}>{cpLabel}</span>
                          </div>
                          {r.connector_id && (
                            <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                              Connector {r.connector_id}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                            <span className={isDark ? "text-white" : "text-neutral-800"}>
                              {formatDuration(r.Started || r.start_time, r.Ended || r.stop_time)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Battery className={`w-4 h-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                            <span className={isDark ? "text-white" : "text-neutral-800"}>
                              {energy.toFixed(3)} kWh
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`w-4 h-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                            <span className={isDark ? "text-white" : "text-neutral-800"}>
                              {Number.isFinite(+r.total) ? `${(+r.total).toFixed(2)} €` : "—"}
                            </span>
                          </div>
                          {r.price_kwh && (
                            <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                              @ {r.price_kwh} €/kWh
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
                            <span className={isDark ? "text-white" : "text-neutral-800"}>
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

