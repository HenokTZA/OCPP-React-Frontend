import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowLeft,
  RefreshCw,
  Zap,
  Settings,
  Play,
  StopCircle,
  Download,
  Upload,
  List,
  Cpu,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  BarChart3,
  Server,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [cp, setCp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("info");
  const [commandHistory, setCommandHistory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("availability");

  useEffect(() => {
    setLoading(true);
    fetchJson(`/charge-points/${id}/`)
      .then(setCp)
      .catch(() => navigate("/"))
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

  const ask = (q) => window.prompt(q) ?? "";
  const asNum = (q) => Number(ask(q));

  const CommandButton = ({
    icon: Icon,
    label,
    description,
    color = "blue",
    onClick,
    disabled = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isDark
          ? "bg-zinc-900 hover:bg-zinc-800"
          : "bg-white hover:bg-gray-50"
      } border ${isDark ? "border-zinc-700" : "border-gray-200"} shadow-sm`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            color === "blue"
              ? "bg-blue-100 text-blue-600"
              : color === "green"
              ? "bg-green-100 text-green-600"
              : color === "red"
              ? "bg-red-100 text-red-600"
              : color === "yellow"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          } ${isDark ? "!bg-opacity-20" : ""}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {label}
          </h3>
          <p
            className={`text-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );

  const commandCategories = [
    { id: "availability", label: "Availability", icon: Server },
    { id: "transactions", label: "Transactions", icon: Zap },
    { id: "firmware", label: "Firmware", icon: Download },
    { id: "configuration", label: "Configuration", icon: Settings },
    { id: "charging", label: "Charging Profiles", icon: BarChart3 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300";
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
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
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h1
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Charge Point Not Found
            </h1>
            <p
              className={
                isDark
                  ? "text-dark-text-secondary"
                  : "text-light-text-secondary"
              }
            >
              The requested charge point could not be loaded.
            </p>
            <button
              onClick={() => navigate("/")}
              className={`mt-4 px-4 py-2 rounded-lg ${
                isDark
                  ? "bg-dark-bg-secondary text-white hover:bg-dark-border-secondary"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`h-full p-4 md:p-6 `}>
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/manage")}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1
                  className={`text-2xl md:text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {cp.name || `Charge Point ${cp.id}`}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? "bg-opacity-20 text-white" : "text-gray-800"
                  } ${
                    cp.status === "Available"
                      ? "bg-green-500"
                      : cp.status === "Charging"
                      ? "bg-yellow-500"
                      : cp.status === "Unavailable"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  {cp.status || "Unknown"}
                </span>
                <span
                  className={`text-sm ${
                    isDark
                      ? "text-dark-text-secondary"
                      : "text-light-text-secondary"
                  }`}
                >
                  ID: {cp.id}
                </span>
                {cp.connector_id && (
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-dark-text-secondary"
                        : "text-light-text-secondary"
                    }`}
                  >
                    Connector: {cp.connector_id}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchJson(`/charge-points/${id}/`)
                  .then(setCp)
                  .finally(() => setLoading(false));
              }}
              className={`p-2 rounded-lg ${
                isDark
                  ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Status Message */}
          {msg && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                msgType === "success"
                  ? isDark
                    ? "bg-green-900/20 text-green-300"
                    : "bg-green-50 text-green-800"
                  : msgType === "error"
                  ? isDark
                    ? "bg-red-900/20 text-red-300"
                    : "bg-red-50 text-red-800"
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

          {/* Command Categories */}
          <div
            className={`rounded-lg overflow-hidden ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-6">
              <h2
                className={`text-lg font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                OCPP Commands
              </h2>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {commandCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? isDark
                            ? "bg-zinc-800 text-white"
                            : "bg-green-600 text-white"
                          : isDark
                          ? "bg-dark-bg-primary text-dark-text-secondary hover:bg-zinc-900"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>

              {/* Command Buttons */}
              <div className="grid gap-3">
                {activeCategory === "availability" && (
                  <>
                    <CommandButton
                      icon={Server}
                      label="Change Availability"
                      description="Set charge point to Inoperative state"
                      color="blue"
                      onClick={() =>
                        send("ChangeAvailability", {
                          connectorId: cp.connector_id,
                          type: "Inoperative",
                        })
                      }
                    />
                  </>
                )}

                {activeCategory === "transactions" && (
                  <>
                    <CommandButton
                      icon={Play}
                      label="Remote Start Transaction"
                      description="Start a charging session remotely"
                      color="green"
                      onClick={() =>
                        send("RemoteStartTransaction", {
                          connectorId: cp.connector_id,
                          idTag: "demo",
                        })
                      }
                    />

                    <CommandButton
                      icon={StopCircle}
                      label="Remote Stop Transaction"
                      description="Stop an ongoing charging session"
                      color="red"
                      onClick={() =>
                        send("RemoteStopTransaction", {
                          transactionId: asNum("Transaction ID?"),
                        })
                      }
                    />
                  </>
                )}

                {activeCategory === "firmware" && (
                  <>
                    <CommandButton
                      icon={Download}
                      label="Update Firmware"
                      description="Initiate firmware update process"
                      color="purple"
                      onClick={() =>
                        send("UpdateFirmware", {
                          location: "http://example.com/fw.bin",
                          retrieveDate: new Date().toISOString(),
                        })
                      }
                    />
                  </>
                )}

                {activeCategory === "configuration" && (
                  <>
                    <CommandButton
                      icon={List}
                      label="Get Configuration"
                      description="Retrieve current configuration settings"
                      color="blue"
                      onClick={() => {
                        const k = ask("Key (empty = all)?");
                        const keys = k ? [k] : [];
                        send("GetConfiguration", { key: keys });
                      }}
                    />

                    <CommandButton
                      icon={Settings}
                      label="Change Configuration"
                      description="Modify charge point configuration"
                      color="yellow"
                      onClick={() => {
                        const key = ask("Config key?");
                        const value = ask("New value?");
                        if (key) send("ChangeConfiguration", { key, value });
                      }}
                    />

                    <CommandButton
                      icon={Cpu}
                      label="Get Local List Version"
                      description="Retrieve authorization list version"
                      color="gray"
                      onClick={() => send("GetLocalListVersion")}
                    />
                  </>
                )}

                {activeCategory === "charging" && (
                  <>
                    <CommandButton
                      icon={BarChart3}
                      label="Set Charging Profile"
                      description="Configure 16A demo charging profile"
                      color="green"
                      onClick={() => {
                        const profile = {
                          chargingProfileId: 1,
                          stackLevel: 0,
                          chargingProfilePurpose: "TxProfile",
                          chargingProfileKind: "Absolute",
                          chargingSchedule: {
                            duration: 300,
                            startSchedule: new Date().toISOString(),
                            chargingRateUnit: "A",
                            chargingSchedulePeriod: [
                              { startPeriod: 0, limit: 16 },
                            ],
                          },
                        };
                        send("SetChargingProfile", {
                          connectorId: cp.connector_id,
                          csChargingProfiles: profile,
                        });
                      }}
                    />

                    <CommandButton
                      icon={Wrench}
                      label="Clear Charging Profile"
                      description="Remove charging profile configuration"
                      color="red"
                      onClick={() =>
                        send("ClearChargingProfile", {
                          id: asNum("Profile ID (0 = all)?") || 0,
                        })
                      }
                    />

                    <CommandButton
                      icon={Clock}
                      label="Get Composite Schedule"
                      description="Retrieve scheduled charging information"
                      color="blue"
                      onClick={() =>
                        send("GetCompositeSchedule", {
                          connectorId: cp.connector_id,
                          duration: asNum("Horizon in seconds?") || 3600,
                        })
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <div
              className={`rounded-xl overflow-hidden ${
                isDark ? "bg-dark-bg-secondary" : "bg-white"
              } shadow-sm`}
            >
              <div className="p-6">
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Command History
                </h2>

                <div className="space-y-3">
                  {commandHistory.map((cmd) => (
                    <div
                      key={cmd.id}
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "border-dark-border-secondary"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              cmd.status
                            )}`}
                          >
                            {cmd.status.toUpperCase()}
                          </span>
                          <span
                            className={`font-mono text-sm ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {cmd.action}
                          </span>
                        </div>
                        <span
                          className={`text-xs ${
                            isDark
                              ? "text-dark-text-secondary"
                              : "text-light-text-secondary"
                          }`}
                        >
                          {new Date(cmd.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {cmd.params && Object.keys(cmd.params).length > 0 && (
                        <div
                          className={`text-xs mt-2 ${
                            isDark
                              ? "text-dark-text-secondary"
                              : "text-light-text-secondary"
                          }`}
                        >
                          <strong>Params:</strong> {JSON.stringify(cmd.params)}
                        </div>
                      )}

                      {cmd.response && (
                        <div
                          className={`text-xs mt-2 ${
                            isDark
                              ? "text-dark-text-secondary"
                              : "text-light-text-secondary"
                          }`}
                        >
                          <strong>Response:</strong>{" "}
                          {JSON.stringify(cmd.response)}
                        </div>
                      )}

                      {cmd.error && (
                        <div className={`text-xs mt-2 text-red-500`}>
                          <strong>Error:</strong> {cmd.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
