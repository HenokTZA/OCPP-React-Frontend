import Modal from "./ui/Modal";
import {
  Calendar,
  Percent,
  Download,
  FileText,
  FileSpreadsheet,
  X,
  Loader2,
  BarChart3,
} from "lucide-react";

function ReportModal({
  setOpen,
  selectedCount,
  isDark,
  createReport,
  busy,
  start,
  setStart,
  end,
  setEnd,
  tax,
  setTax,
  fmt,
  setFmt,
}) {
  return (
    <Modal onClose={() => !busy && setOpen(false)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-neutral-800"
            }`}
          >
            Generate Report
          </h2>
        </div>
        {!busy && (
          <button
            onClick={() => setOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Grid */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </div>
            </label>
            <input
              type="date"
              value={start}
              className={`w-full px-3 py-2.5 rounded-xl border ${
                isDark
                  ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </div>
            </label>
            <input
              type="date"
              value={end}
              className={`w-full px-3 py-2.5 rounded-xl border ${
                isDark
                  ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Tax Rate (%)
            </div>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={tax}
            className={`w-full px-3 py-2.5 rounded-xl border ${
              isDark
                ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400"
            } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            onChange={(e) => setTax(e.target.value)}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Format
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFmt("pdf")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                fmt === "pdf"
                  ? isDark
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-emerald-600 border-emerald-600 text-white"
                  : isDark
                  ? "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-emerald-500"
                  : "bg-white border-neutral-200 text-neutral-700 hover:border-emerald-500"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setFmt("excel")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                fmt === "excel"
                  ? isDark
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-emerald-600 border-emerald-600 text-white"
                  : isDark
                  ? "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-emerald-500"
                  : "bg-white border-neutral-200 text-neutral-700 hover:border-emerald-500"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-sm">Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className={`p-4 rounded-xl mb-6 ${
          isDark ? "bg-neutral-800" : "bg-neutral-100"
        }`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${
            isDark ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          Report Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Charge Points:
            </span>
            <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
              {selectedCount} selected
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Period:
            </span>
            <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
              {start} to {end}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Format:
            </span>
            <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
              {fmt.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Tax Rate:
            </span>
            <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>
              {tax}%
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setOpen(false)}
          disabled={busy}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isDark
              ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          } disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          onClick={createReport}
          disabled={busy}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            busy
              ? "bg-neutral-400 cursor-not-allowed text-white"
              : isDark
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

export default ReportModal;
