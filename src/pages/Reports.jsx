import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchJson, fetchBlob, downloadBlob } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import DashboardLayout from "@/components/DashboardLayout";
import {
  FileText,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import ReportModal from "../components/ReportModal";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Reports() {
  const { isDark } = useTheme();
  const [cps, setCps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  // modal fields
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [tax, setTax] = useState("0");
  const [fmt, setFmt] = useState("pdf");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchJson("/charge-points/")
      .then(setCps)
      .catch((e) => {
        console.error("Failed to load CPs:", e);
        setError("Failed to load charge points");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(cps.map((c) => c.id)));
  const clearAll = () => setSelected(new Set());

  const selectedCount = selected.size;
  const totalCount = cps?.length || 0;

  async function createReport() {
    if (!selected.size) {
      setError("Please select at least one charging station");
      return;
    }
    if (!start || !end) {
      setError("Please select start and end dates");
      return;
    }
    if (start > end) {
      setError("Start date cannot be after end date");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const payload = {
        cp_ids: [...selected],
        start,
        end,
        tax_rate: Number(tax),
        format: fmt,
      };

      const blob = await fetchBlob("/reports/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const ext = fmt === "excel" ? "xlsx" : "pdf";
      downloadBlob(blob, `charging_report_${start}_to_${end}.${ext}`);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Failed to create report. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading)
    return (
      <LoadingSpinner message="Loading charge points..." isDark={isDark} />
    );

  return (
    <DashboardLayout>
      <div className={`h-full p-6 space-y-6`}>
        <div className="w-full space-y-6">
          {error && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isDark ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-800"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Selection Controls */}
          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {selectedCount} of {totalCount} stations selected
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isDark
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Select All
                </button>

                <button
                  onClick={clearAll}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isDark
                      ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  <Square className="w-4 h-4" />
                  Clear All
                </button>

                <button
                  onClick={() => setOpen(true)}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCount === 0
                      ? isDark
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : isDark
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Charge Points List */}
          <div
            className={`rounded-xl overflow-hidden ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? "border-neutral-800" : "border-neutral-100"
                    }`}
                  >
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Select
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Charge Point
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Status
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Connector
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span
                        className={
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }
                      >
                        Location
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {cps.map((cp) => (
                    <tr
                      key={cp.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-50"
                      } ${
                        selected.has(cp.id)
                          ? isDark
                            ? "bg-neutral-800"
                            : "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selected.has(cp.id)}
                          onChange={() => toggle(cp.id)}
                          className={`w-4 h-4 rounded ${
                            isDark
                              ? "bg-neutral-800 border-neutral-700 text-emerald-600"
                              : "border-neutral-300 text-emerald-600"
                          } focus:ring-emerald-500`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-neutral-900"
                          }`}
                        >
                          {cp.name || `CP ${cp.id}`}
                        </span>
                        <div
                          className={`text-xs ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          ID: {cp.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isDark
                              ? "bg-opacity-20 text-white"
                              : "text-neutral-800"
                          } ${
                            cp.status === "Available"
                              ? "bg-emerald-500"
                              : cp.status === "Charging"
                              ? "bg-amber-500"
                              : cp.status === "Unavailable"
                              ? "bg-rose-500"
                              : "bg-neutral-500"
                          }`}
                        >
                          {cp.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={isDark ? "text-white" : "text-neutral-900"}
                        >
                          {cp.connector_id || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }
                        >
                          {cp.location || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {cps.length === 0 && (
            <div
              className={`text-center py-12 rounded-xl ${
                isDark ? "bg-neutral-900" : "bg-white"
              } shadow-sm`}
            >
              <FileText
                className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                No charge points found
              </h3>
              <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
                There are no charge points available to generate reports.
              </p>
            </div>
          )}

          {/* Report Modal */}
          {open &&
            createPortal(
              <ReportModal
                setOpen={setOpen}
                busy={busy}
                selectedCount={selectedCount}
                isDark={isDark}
                createReport={createReport}
                start={start}
                setStart={setStart}
                end={end}
                setEnd={setEnd}
                tax={tax}
                setTax={setTax}
                fmt={fmt}
                setFmt={setFmt}
              />,
              document.body
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}
