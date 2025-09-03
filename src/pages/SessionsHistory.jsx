import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import DashboardLayout from "@/components/DashboardLayout";
import { Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SessionsHistory() {
  const { isDark } = useTheme();
  const [rows, setRows] = useState([]);
  const [cps, setCps] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    Promise.all([
      fetchJson(`/sessions/?page=${page}&page_size=${pageSize}`),
      fetchJson(`/charge-points/`),
    ])
      .then(([res, c]) => {
        if (cancel) return;
        setRows(res.results || res);
        setCount(res.count ?? null);
        setCps(c || []);
      })
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [page]);

  const money = (n) => `€${Number(n || 0).toFixed(2)}`;
  const findCp = (id) =>
    cps.find((cp) => String(cp.id ?? cp.pk) === String(id));

  function totalFor(s) {
    if (s.total_eur != null) return Number(s.total_eur);

    const cp = findCp(s.cp ?? s.cp_id);
    if (!cp) return 0;

    const kwh = Number(s.kWh ?? s.kwh ?? 0);
    const byEnergy = (Number(cp.price_per_kwh) || 0) * kwh;

    let byTime = 0;
    const start = s.Started || s.started;
    const end = s.Ended || s.ended;
    if (cp.price_per_hour && start && end) {
      const hours = Math.max(0, (new Date(end) - new Date(start)) / 36e5);
      byTime = hours * Number(cp.price_per_hour);
    }
    return byEnergy + byTime;
  }

  if (loading)
    return (
      <LoadingSpinner message="Loading session history..." isDark={isDark} />
    );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {false ? (
          <div
            className={`flex flex-col items-center justify-center py-16 space-y-4 rounded-lg ${
              isDark ? "text-emerald-500" : "text-[#539C06]"
            }`}
          ></div>
        ) : (
          <div
            className={`rounded-lg overflow-hidden ${
              isDark
                ? "bg-[#0f0f0e] border border-neutral-800"
                : "bg-white border border-neutral-100 shadow-sm"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`text-left border-b ${
                    isDark ? "border-neutral-800" : "border-neutral-100"
                  }`}
                >
                  <tr
                    className={`${isDark ? "bg-neutral-900" : "bg-neutral-50"}`}
                  >
                    {[
                      "ID",
                      "Charge Point",
                      "Energy (kWh)",
                      "Started",
                      "Stopped",
                      "Total",
                    ].map((header) => (
                      <th
                        key={header}
                        className={`p-4 font-medium text-xs uppercase tracking-wider ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const k = Number(s.kWh ?? s.kwh ?? 0);
                    return (
                      <tr
                        key={s.id}
                        className={`border-b last:border-0 transition-colors ${
                          isDark
                            ? "border-neutral-800 hover:bg-neutral-900"
                            : "border-neutral-100 hover:bg-neutral-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-medium ${
                            isDark ? "text-white" : "text-neutral-800"
                          }`}
                        >
                          #{s.id}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-neutral-300" : "text-neutral-700"
                          }`}
                        >
                          {s.cp ?? s.cp_id}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-neutral-300" : "text-neutral-700"
                          }`}
                        >
                          {k.toFixed(3)}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {s.Started || s.started
                            ? new Date(s.Started || s.started).toLocaleString()
                            : "—"}
                        </td>
                        <td
                          className={`p-4 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {s.Ended || s.ended
                            ? new Date(s.Ended || s.ended).toLocaleString()
                            : "—"}
                        </td>
                        <td
                          className={`p-4 text-right font-semibold ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          {money(totalFor(s))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {count != null && (
          <div className="flex items-center justify-between mt-6">
            <div
              className={`text-sm ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, count)} of {count} sessions
            </div>
            <div className="flex gap-2">
              <button
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  page <= 1
                    ? isDark
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : isDark
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  rows.length < pageSize
                    ? isDark
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : isDark
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
                disabled={rows.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
