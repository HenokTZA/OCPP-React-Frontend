import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import {
  ArrowLeft,
  Zap,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Play,
  StopCircle,
  RefreshCw,
  Navigation,
  Battery,
  Calendar,
  DollarSign,
  CheckCircle,
  Key,
  BatteryCharging,
  Plug,
  Settings,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import UserLoadingSpinner from "@/components/UserLoadingSpinner";

const PLUG_LABELS = {
  type2: "Type 2",
  eu: "EU Schuko",
  uk: "UK",
  swiss: "Swiss",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
};

const ACCESS_LABELS = {
  public: "Public",
  limited: "Limited",
  private: "Private",
};

export default function CPDetailPage({ byCode = false }) {
  const { cpId, code } = useParams();
  const [search] = useSearchParams();
  const { isDark } = useTheme();

  const [cp, setCp] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [processedSession, setProcessedSession] = useState(false);
  const [amount, setAmount] = useState(5);

  const isCharging = useMemo(() => cp?.status === "Charging", [cp?.status]);
  const cpRef = useRef(null);
  useEffect(() => {
    cpRef.current = cp;
  }, [cp]);

  async function refresh() {
    try {
      const path = byCode
        ? `/public/charge-points/by-code/${encodeURIComponent(code)}/`
        : `/public/charge-points/${encodeURIComponent(cpId)}/`;
      const data = await fetchJson(path);
      setCp(data);
      return data;
    } catch (error) {
      setErr("Failed to load charge point details");
      throw error;
    }
  }

  // Poll helper (used after stop to flip button back)
  async function pollUntilNotCharging(timeoutMs = 15000, everyMs = 1000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const data = await refresh();
      if (data?.status !== "Charging") return true;
      await new Promise((r) => setTimeout(r, everyMs));
    }
    return false;
  }

  // After checkout → wait until CP reports Charging so the UI shows Stop
  async function pollUntilCharging(timeoutMs = 15000, everyMs = 1000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const data = await refresh();
      if (data?.status === "Charging") return true;
      await new Promise((r) => setTimeout(r, everyMs));
    }
    return false;
  }

  useEffect(() => {
    (async () => {
      try {
        await refresh();

        // If Stripe redirected back with ?session_id=..., handle once then strip it
        const sessionId = search.get("session_id");
        if (sessionId && !processedSession) {
          setProcessedSession(true);
          setBusy(true);
          try {
            await fetchJson(
              `/public/charge-points/${encodeURIComponent(
                cpId
              )}/start-after-checkout/`,
              {
                method: "POST",
                body: JSON.stringify({ session_id: sessionId }),
              }
            );
            // Remove query param so refresh won't re-trigger start
            window.history.replaceState({}, "", window.location.pathname);
            await pollUntilCharging();
          } finally {
            setBusy(false);
          }
        }
      } catch (e) {
        setErr("Forbidden or not found");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byCode, cpId, code, processedSession]);

  // While charging, poll periodically for live kWh / status
  useEffect(() => {
    if (!cp || cp.status !== "Charging") return;
    const id = setInterval(() => {
      refresh().catch(() => {});
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cp?.status]);

  async function onStart() {
    setBusy(true);
    try {
      const { url } = await fetchJson(
        `/public/charge-points/${encodeURIComponent(cpId)}/checkout/`,
        {
          method: "POST",
          body: JSON.stringify({
            amount_cents: amount * 100,
            currency: "eur",
          }),
        }
      );
      window.location.href = url; // redirect to Stripe Checkout
    } finally {
      setBusy(false);
    }
  }

  async function onStop() {
    setBusy(true);
    try {
      // Optimistic UI: reflect transition immediately
      setCp((prev) => (prev ? { ...prev, status: "Finishing" } : prev));
      await fetchJson(
        `/public/charge-points/${encodeURIComponent(cpId)}/stop/`,
        {
          method: "POST",
        }
      );
      await pollUntilNotCharging(); // ensure button flips back reliably
    } finally {
      setBusy(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "charging":
        return "bg-green-500";
      case "available":
        return "bg-blue-500";
      case "finishing":
        return "bg-yellow-500";
      case "faulted":
        return "bg-red-500";
      case "unavailable":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "charging":
        return "Charging";
      case "available":
        return "Available";
      case "finishing":
        return "Finishing";
      case "faulted":
        return "Faulted";
      case "unavailable":
        return "Unavailable";
      default:
        return status || "Unknown";
    }
  };

  const openInMaps = () => {
    if (cp?.lat && cp?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${cp.lat},${cp.lng}`,
        "_blank"
      );
    }
  };

  if (err) {
    return (
      <div
        className={`min-h-screen p-6 flex items-center justify-center ${
          isDark ? "bg-[#0f0f0e]" : "bg-gray-50"
        }`}
      >
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Charge Point Not Found
          </h1>
          <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {err}. Please check the URL or try another charge point.
          </p>
          <Link
            to="/app/map"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
              isDark
                ? "bg-[#0f0f0e] text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  if (!cp) {
    return (
      <UserLoadingSpinner
        message="Loading charge point details..."
        isDark={isDark}
      />
    );
  }

  return (
    <div className={`h-full p-4 md:p-6 `}>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/app/map"
            className={`inline-flex text-sm items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
              isDark
                ? "bg-[#0f0f0e] text-gray-200 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Map
          </Link>

          <button
            onClick={refresh}
            className={`p-3 rounded-xl transition-colors ${
              isDark
                ? "bg-[#0f0f0e] text-gray-200 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Charge Point Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h1
              className={`text-sm md:text-3xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {cp.name || `Charge Point #${cp.pk ?? cp.id}`}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isDark ? "bg-opacity-20 text-white" : "text-gray-800"
                } ${getStatusColor(cp.status)}`}
              >
                {getStatusText(cp.status)}
              </span>

            </div>

            {cp.location && (
              <div className="flex items-center gap-2 mb-3">
                <MapPin
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {cp.location}
                </p>
              </div>
            )}

            {cp.lat && cp.lng && (
              <button
                onClick={openInMaps}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-medium transition-colors mt-2 ${
                  isDark
                    ? "bg-[#0f0f0e] text-green-400 hover:bg-gray-700"
                    : "bg-white text-green-600 hover:bg-gray-100 shadow-sm"
                }`}
              >
                <Navigation className="w-4 h-4" />
                Open in Maps
              </button>
            )}
          </div>

          {/* Owner Info */}
          {cp.owner_username && (
            <div
              className={`p-5 rounded-xl ${
                isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <User
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Operator
                </span>
              </div>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                {cp.owner_username}
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Energy Pricing Card */}
          <div
            className={`p-6 rounded-xl text-sm ${
              isDark
                ? "bg-[#0f0f0e] border border-gray-800"
                : "bg-white shadow-sm border border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-yellow-500/20" : "bg-yellow-100"
                }`}
              >
                <Zap
                  className={`w-5 h-5 ${
                    isDark ? "text-yellow-400" : "text-yellow-500"
                  }`}
                />
              </div>
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Energy Pricing
              </h3>
            </div>
            <div
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {cp.price_per_kwh ? (Number(cp.price_per_kwh) / 1).toFixed(3) : "—"} €/kWh
            </div>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Price per kilowatt-hour
              {/* {cp.effective_price_per_kwh != null &&
                cp.effective_price_per_kwh !== cp.price_per_kwh && (
                  <span className="ml-2 text-xs opacity-70">
                    (default: {cp.price_per_kwh ?? "—"})
                  </span>
                )} */}
            </p>
          </div>

          {/* Time Pricing Card */}
          <div
            className={`p-6 rounded-xl text-sm ${
              isDark
                ? "bg-[#0f0f0e] border border-gray-800"
                : "bg-white shadow-sm border border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-blue-500/20" : "bg-blue-100"
                }`}
              >
                <Clock
                  className={`w-5 h-5 ${
                    isDark ? "text-blue-400" : "text-blue-500"
                  }`}
                />
              </div>
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Time Pricing
              </h3>
            </div>
            <div
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {cp.price_per_hour ? (Number(cp.price_per_hour) / 1).toFixed(2) : "—"} €/h
            </div>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Price per hour of charging
              {/* {cp.effective_price_per_hour != null &&
                cp.effective_price_per_hour !== cp.price_per_hour && (
                  <span className="ml-2 text-xs opacity-70">
                    (default: {cp.price_per_hour ?? "—"})
                  </span>
                )} */}
            </p>
          </div>

          {/* Additional Details Card */}
          <div
            className={`p-6 rounded-xl text-sm md:col-span-2 ${
              isDark
                ? "bg-[#0f0f0e] border border-gray-800"
                : "bg-white shadow-sm border border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-green-500/20" : "bg-green-100"
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              <h3
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Charging Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Plug
                    className={`w-5 h-5 mt-0.5 ${
                      isDark ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      Plug type
                    </p>
                    <p
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {cp.plug_type_label || PLUG_LABELS[cp.plug_type] || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BatteryCharging
                    className={`w-5 h-5 mt-0.5 ${
                      isDark ? "text-yellow-400" : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      Max power
                    </p>
                    <p
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {cp.max_power_kw ? Number(cp.max_power_kw).toFixed(1) : "—"} kW
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Plug
                    className={`w-5 h-5 mt-0.5 ${
                      isDark ? "text-orange-400" : "text-orange-500"
                    }`}
                  />
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      Connector ID
                    </p>
                    <p
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {cp.connector_id ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Key
                    className={`w-5 h-5 mt-0.5 ${
                      isDark ? "text-purple-400" : "text-purple-500"
                    }`}
                  />
                  <div>
                    <p
                      className={
                        isDark
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      Access type
                    </p>
                    <p
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-gray-900 font-medium"
                      }
                    >
                      {cp.access_type_label ||
                        ACCESS_LABELS[cp.access_type] ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Info & Controls */}
        <div
          className={`p-6 rounded-2xl ${
            isDark ? "bg-[#0f0f0e]" : "bg-white shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Charging Session
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cp.current_kwh && (
                  <div
                    className={`p-4 rounded-xl ${
                      isDark ? "bg-zinc-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Battery
                        className={`w-5 h-5 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Energy Delivered
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {Number(cp.current_kwh).toFixed(3)} kWh
                    </div>
                  </div>
                )}

                {cp.updated && (
                  <div
                    className={`p-4 rounded-xl ${
                      isDark ? "bg-zinc-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar
                        className={`w-5 h-5 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Last Updated
                      </span>
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(cp.updated).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[240px]">
              {!isCharging ? (
                <>
                  <div className="flex items-center gap-2">
                    <DollarSign
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      Amount (€)
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className={`px-4 py-2 rounded-md border-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:outline-none"
                        : "bg-white border-gray-300 text-gray-900 focus:outline-none"
                    }`}
                  />
                  <button
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                      busy || cp.status === "Faulted"
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                    }`}
                    disabled={busy || cp.status === "Faulted"}
                    onClick={onStart}
                  >
                    <Play className="w-5 h-5" />
                    {busy ? "Redirecting..." : `Start Charging (€${amount})`}
                  </button>
                </>
              ) : (
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                    busy
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-md"
                  }`}
                  disabled={busy}
                  onClick={onStop}
                >
                  <StopCircle className="w-5 h-5" />
                  {busy ? "Stopping..." : "Stop Charging"}
                </button>
              )}
            </div>
          </div>

          {cp.status === "Faulted" && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isDark
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                This charger is currently faulted and unavailable for charging.
              </p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        {cp.lat != null && cp.lng != null && (
          <div
            className={`text-sm text-center ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Coordinates: {cp.lat}, {cp.lng}
          </div>
        )}
      </div>
    </div>
  );
}
