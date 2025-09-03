import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Cpu,
  Server,
  Zap,
  MapPin,
  Clock,
  Play,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DiagnoseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [cp, setCp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("info"); // success, error, info
  const [commandHistory, setCommandHistory] = useState([]);
  const [expandedCommand, setExpandedCommand] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchJson(`/charge-points/${id}/`)
      .then(setCp)
      .catch(() => navigate("/diagnose"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function send(action, params = {}) {
    setMsg("Sending command...");
    setMsgType("info");

    // Add to command history
    const commandEntry = {
      id: Date.now(),
      action,
      params,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    setCommandHistory((prev) => [commandEntry, ...prev]);

    try {
      const out = await fetchJson(`/charge-points/${id}/command/`, {
        method: "POST",
        body: JSON.stringify({ action, params }),
      });

      setMsg(`${action} command sent successfully → ${out.detail || "queued"}`);
      setMsgType("success");

      // Update command history
      setCommandHistory((prev) =>
        prev.map((cmd) =>
          cmd.id === commandEntry.id
            ? { ...cmd, status: "success", response: out }
            : cmd
        )
      );
    } catch (e) {
      const errorMsg = e.message || "Error sending command";
      setMsg(`Error: ${errorMsg}`);
      setMsgType("error");

      // Update command history
      setCommandHistory((prev) =>
        prev.map((cmd) =>
          cmd.id === commandEntry.id
            ? { ...cmd, status: "error", error: errorMsg }
            : cmd
        )
      );
    }
  }

  const CommandButton = ({
    icon: Icon,
    label,
    action,
    description,
    color = "blue",
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl transition-all ${
        isDark
          ? "bg-[#0f0f0e] hover:bg-neutral-800 border-neutral-800"
          : "bg-white hover:bg-neutral-50 border-neutral-200"
      } border shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              color === "blue"
                ? "bg-blue-500/10 text-blue-500"
                : color === "green"
                ? "bg-emerald-500/10 text-emerald-500"
                : color === "red"
                ? "bg-rose-500/10 text-rose-500"
                : "bg-neutral-500/10 text-neutral-500"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-semibold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {label}
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Play
            className={`w-4 h-4 ${
              isDark ? "text-neutral-400" : "text-neutral-500"
            }`}
          />
        </div>
      </div>
    </button>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400";
      case "error":
        return "text-rose-600 bg-rose-500/10 dark:text-rose-400";
      case "pending":
        return "text-amber-600 bg-amber-500/10 dark:text-amber-400";
      default:
        return "text-neutral-600 bg-neutral-500/10 dark:text-neutral-400";
    }
  };

  const getStatusBadgeColor = (status) => {
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

  if (loading)
    return (
      <LoadingSpinner
        message="Loading charge point details..."
        isDark={isDark}
      />
    );

  if (!cp) {
    return (
      <DashboardLayout>
        <div className={`h-full flex items-center justify-center`}>
          <div className="text-center">
            <AlertCircle
              className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? "text-rose-500" : "text-rose-600"
              }`}
            />
            <h1
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              Charge Point Not Found
            </h1>
            <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              The requested charge point could not be loaded.
            </p>
            <button
              onClick={() => navigate("/diagnose")}
              className={`mt-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
                isDark
                  ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              } transition-colors`}
            >
              Back to Diagnostics
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`h-full p-6 space-y-6 `}>
        <div className="w-full space-y-6">
          {/* Header */}
          <div className={`flex flex-col`}>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/diagnose"
                className={`p-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-neutral-400 hover:bg-[#0f0f0e] hover:text-neutral-200"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1
                className={`text-2xl font-semibold ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                Diagnostics
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p
                className={`text-sm ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Charge Point ID: {cp.id}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isDark ? "bg-opacity-20 text-white" : "text-neutral-800"
                } ${getStatusBadgeColor(cp.status)}`}
              >
                {cp.status || "Unknown"}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {msg && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                msgType === "success"
                  ? isDark
                    ? "bg-[#0f0f0e] text-emerald-300"
                    : "bg-emerald-50 text-emerald-800"
                  : msgType === "error"
                  ? isDark
                    ? "bg-rose-900/20 text-rose-300"
                    : "bg-rose-50 text-rose-800"
                  : isDark
                  ? "bg-blue-900/20 text-blue-300"
                  : "bg-blue-50 text-blue-800"
              }`}
            >
              {msgType === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : msgType === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <RefreshCw className="w-5 h-5 animate-spin" />
              )}
              <p className="text-sm">{msg}</p>
            </div>
          )}

          {/* Command Section */}
          <div
            className={`rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-6">
              <h2
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                OCPP Commands
              </h2>
              <p
                className={`text-sm mb-6 ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Send commands to the charge point for diagnostics and
                maintenance
              </p>

              <div className="space-y-4">
                {/* Reset Command */}
                <CommandButton
                  icon={RefreshCw}
                  label="Reset"
                  action="Reset"
                  description="Restart the charge point (Soft or Hard reset)"
                  color="blue"
                  onClick={() => {
                    const type =
                      prompt("Reset type? (Soft/Hard)")?.trim() || "Soft";
                    if (type) send("Reset", { type });
                  }}
                />

                {/* GetDiagnostics Command */}
                <CommandButton
                  icon={Download}
                  label="Get Diagnostics"
                  action="GetDiagnostics"
                  description="Retrieve diagnostic information from the charge point"
                  color="green"
                  onClick={() => {
                    const location = prompt("Diagnostics upload URL?");
                    if (location) send("GetDiagnostics", { location });
                  }}
                />

                {/* FirmwareStatusNotification Command */}
                <CommandButton
                  icon={Upload}
                  label="Firmware Status"
                  action="FirmwareStatusNotification"
                  description="Update firmware status information"
                  color="purple"
                  onClick={() => {
                    const status =
                      prompt(
                        "Firmware status? (Idle, Downloading, Downloaded, Installing, Installed, DownloadFailed, InstallationFailed)"
                      )?.trim() || "Idle";
                    if (status) send("FirmwareStatusNotification", { status });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <div
              className={`rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white"
              } shadow-sm`}
            >
              <div className="p-6">
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-neutral-800"
                  }`}
                >
                  Command History
                </h2>

                <div className="space-y-3">
                  {commandHistory.map((cmd) => (
                    <div
                      key={cmd.id}
                      className={`p-4 rounded-xl border ${
                        isDark ? "border-neutral-800" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                              cmd.status
                            )}`}
                          >
                            {cmd.status.toUpperCase()}
                          </span>
                          <span
                            className={`font-mono text-sm ${
                              isDark ? "text-white" : "text-neutral-800"
                            }`}
                          >
                            {cmd.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            className={`w-4 h-4 ${
                              isDark ? "text-neutral-400" : "text-neutral-500"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              isDark ? "text-neutral-400" : "text-neutral-600"
                            }`}
                          >
                            {new Date(cmd.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {cmd.params && Object.keys(cmd.params).length > 0 && (
                        <div
                          className={`text-xs mt-2 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          <strong>Params:</strong> {JSON.stringify(cmd.params)}
                        </div>
                      )}

                      {cmd.response && (
                        <div
                          className={`text-xs mt-2 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          <strong>Response:</strong>{" "}
                          {JSON.stringify(cmd.response)}
                        </div>
                      )}

                      {cmd.error && (
                        <div className={`text-xs mt-2 text-rose-500`}>
                          <strong>Error:</strong> {cmd.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Charge Point Info */}
          <div
            className={`rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-6">
              <h2
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-neutral-800"
                }`}
              >
                Charge Point Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Server
                    className={`w-5 h-5 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      ID
                    </p>
                    <p className={isDark ? "text-white" : "text-neutral-800"}>
                      {cp.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Zap
                    className={`w-5 h-5 ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    >
                      Status
                    </p>
                    <p className={isDark ? "text-white" : "text-neutral-800"}>
                      {cp.status || "Unknown"}
                    </p>
                  </div>
                </div>

                {cp.connector_type && (
                  <div className="flex items-center gap-3">
                    <Cpu
                      className={`w-5 h-5 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Connector
                      </p>
                      <p className={isDark ? "text-white" : "text-neutral-800"}>
                        {cp.connector_type}
                      </p>
                    </div>
                  </div>
                )}

                {cp.location && (
                  <div className="flex items-center gap-3">
                    <MapPin
                      className={`w-5 h-5 ${
                        isDark ? "text-neutral-400" : "text-neutral-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Location
                      </p>
                      <p className={isDark ? "text-white" : "text-neutral-800"}>
                        {cp.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
