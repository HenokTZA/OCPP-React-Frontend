import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchJson } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/lib/theme";
import {
  Settings,
  MapPin,
  Users,
  MoreVertical,
  Zap,
  Clock,
  Cpu,
  Link as LinkIcon,
  Loader2,
  X,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import LocationPickerModal from "@/components/LocationPickerModal";

// Leaflet + geocoder
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import LoadingSpinner from "../components/LoadingSpinner";

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/* helpers */
const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");
const patchCP = (id, body) =>
  fetchJson(`/charge-points/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export default function Manage() {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const [me, setMe] = useState(null);
  const [cps, setCps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // menu / modals state
  const [menuOpen, setMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [editCP, setEdit] = useState(null);
  const [locCP, setLocCP] = useState(null);
  const [usersCP, setUsersCP] = useState(null);

  // temp fields inside modals
  const [tmpK, setTmpK] = useState("");
  const [tmpH, setTmpH] = useState("");
  const [tmpL, setTmpL] = useState("");
  const [tmpLat, setTmpLat] = useState(null);
  const [tmpLng, setTmpLng] = useState(null);
  const [tmpPlug, setTmpPlug] = useState("");
  const [tmpPower, setTmpPower] = useState("");
  const [tmpAccess, setTmpAccess] = useState("");

  const [userRows, setUserRows] = useState([]);
  const [addEmail, setAddEmail] = useState("");
  const [addK, setAddK] = useState("");
  const [addH, setAddH] = useState("");

  // Options
  const PLUG_OPTIONS = [
    { value: "type2", label: "Type 2" },
    { value: "eu", label: "EU Schuko" },
    { value: "uk", label: "UK" },
    { value: "swiss", label: "Swiss" },
    { value: "ccs2", label: "CCS2" },
    { value: "chademo", label: "CHAdeMO" },
  ];

  const ACCESS_OPTIONS = [
    { value: "public", label: "Public" },
    { value: "limited", label: "Limited" },
    { value: "private", label: "Private" },
  ];

  useEffect(() => {
    fetchJson("/me")
      .then(setMe)
      .catch(() => logout());
  }, [logout]);

  useEffect(() => {
    const load = () =>
      fetchJson("/charge-points/")
        .then(setCps)
        .catch(() => setError("Failed to load charge points"))
        .finally(() => setLoading(false));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function updatePrices(id) {
    const pk = Number(tmpK) || 0;
    const ph = Number(tmpH) || 0;

    const body = {
      price_per_kwh: pk,
      price_per_hour: ph,
      plug_type: tmpPlug || null,
      max_power_kw: tmpPower === "" ? null : Number(tmpPower),
      access_type: tmpAccess || null,
    };

    await patchCP(id, body);
    setCps((arr) =>
      arr.map((c) => (c.id === id || c.pk === id ? { ...c, ...body } : c))
    );
  }

  async function loadUserPrices(cpId) {
    const rows = await fetchJson(`/charge-points/${cpId}/user-prices/`);
    setUserRows((rows || []).map((r) => ({ ...r, editing: false })));
  }

  async function addUserPrice(cpId) {
    const body = {
      email: addEmail.trim(),
      price_per_kwh: addK === "" ? null : Number(addK),
      price_per_hour: addH === "" ? null : Number(addH),
    };
    const row = await fetchJson(`/charge-points/${cpId}/user-prices/`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    setUserRows((arr) => [...arr, { ...row, editing: false }]);
    setAddEmail("");
    setAddK("");
    setAddH("");
  }

  async function patchUserPrice(cpId, upid, patch) {
    const row = await fetchJson(`/charge-points/${cpId}/user-prices/${upid}/`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    setUserRows((arr) =>
      arr.map((x) => (x.id === upid ? { ...row, editing: false } : x))
    );
  }

  async function deleteUserPrice(cpId, upid) {
    await fetchJson(`/charge-points/${cpId}/user-prices/${upid}/`, {
      method: "DELETE",
    });
    setUserRows((arr) => arr.filter((x) => x.id !== upid));
  }

  async function updateLocation(id) {
    const location = tmpL.trim();
    const body = { location };
    if (tmpLat != null && tmpLng != null) {
      body.lat = tmpLat;
      body.lng = tmpLng;
    }
    await patchCP(id, body);
    setCps((arr) => arr.map((c) => (c.id === id ? { ...c, ...body } : c)));
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "charging":
        return "bg-yellow-500";
      case "unavailable":
        return "bg-red-500";
      case "faulted":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  if (!me)
    return (
      <LoadingSpinner message="Loading charge points..." isDark={isDark} />
    );

  if (!me.tenant_ws) {
    return (
      <DashboardLayout>
        <div
          className={`h-full flex items-center justify-center ${
            isDark ? "bg-[#0f0f0e]" : "bg-light-bg-primary"
          }`}
        >
          <div
            className={`p-8 rounded-xl text-center w-full ${
              isDark
                ? "bg-black border border-zinc-800"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              No Tenant Found
            </h2>
            <p className={isDark ? "text-zinc-400" : "text-gray-600"}>
              You don't have a tenant workspace yet. Please contact your
              administrator.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading)
    return (
      <LoadingSpinner message="Loading charge points..." isDark={isDark} />
    );

  const wsUrl = me.tenant_ws.replace(
    /^ws:\/\/[^/]+/,
    "ws://147.93.127.215:9000"
  );

  return (
    <DashboardLayout>
      <div className={`h-full p-4 md:p-6`}>
        <div className="w-full space-y-6 h-full">
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

          {/* WebSocket URL Section */}
          <div
            className={`p-6 rounded-lg ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Connection Endpoint
              </div>
            </h2>
            <p
              className={`text-sm mb-3 ${
                isDark ? "text-zinc-400" : "text-light-text-secondary"
              }`}
            >
              Connect your charge points to this WebSocket URL:
            </p>
            <div
              className={`p-3 rounded-md font-mono text-sm break-all ${
                isDark
                  ? "bg-black text-green-400 border border-zinc-800"
                  : "bg-gray-100 text-green-800 border border-gray-200"
              }`}
            >
              {wsUrl}
            </div>
          </div>

          {/* Charge Points List */}
          <div
            className={`rounded-lg overflow-hidden h-auto ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Charge Points
                </h2>
                <span
                  className={`text-sm ${
                    isDark ? "text-zinc-400" : "text-light-text-secondary"
                  }`}
                >
                  {cps.length} station(s)
                </span>
              </div>

              <div className="overflow-x-auto h-full">
                <table className="w-full h-auto">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? "border-zinc-800" : "border-gray-200"
                      }`}
                    >
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }
                        >
                          Charge Point
                        </span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }
                        >
                          Status
                        </span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }
                        >
                          Pricing
                        </span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }
                        >
                          Updated
                        </span>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        <span
                          className={
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }
                        >
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cps.map((cp) => {
                      const fmtPrice = (v) =>
                        v == null ? "—" : `€${Number(v).toFixed(3)}`;
                      const fmtHour = (v) =>
                        v == null ? "—" : `€${Number(v).toFixed(2)}`;

                      return (
                        <tr
                          key={cp.id}
                          className={`transition-colors ${
                            isDark ? "hover:bg-black" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div>
                              <Link
                                to={`/cp/${cp.id}`}
                                className={`font-semibold hover:underline ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {cp.name || `CP ${cp.id}`}
                              </Link>
                              <div
                                className={`text-xs ${
                                  isDark
                                    ? "text-zinc-400"
                                    : "text-light-text-secondary"
                                }`}
                              >
                                ID: {cp.id} • Connector:{" "}
                                {cp.connector_id || "—"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                isDark
                                  ? "bg-opacity-20 text-white"
                                  : "text-gray-800"
                              } ${getStatusColor(cp.status)}`}
                            >
                              {cp.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div
                              className={`text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {fmtPrice(cp.price_per_kwh)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {fmtHour(cp.price_per_hour)}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-sm ${
                                isDark
                                  ? "text-zinc-400"
                                  : "text-light-text-secondary"
                              }`}
                            >
                              {fmt(cp.updated)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  setMenuPosition({
                                    top: rect.bottom + window.scrollY,
                                    left: rect.right - 208 + window.scrollX, // 208px is the width of the menu (w-52 = 13rem = 208px)
                                  });
                                  setMenu(menuOpen === cp.id ? null : cp.id);
                                }}
                                className={`p-2 rounded-lg ${
                                  isDark
                                    ? "text-zinc-400 hover:bg-black"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {cps.length === 0 && (
                <div className="text-center py-12">
                  <Zap
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? "text-zinc-400" : "text-light-text-secondary"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No Charge Points Found
                  </h3>
                  <p
                    className={
                      isDark ? "text-zinc-400" : "text-light-text-secondary"
                    }
                  >
                    Connect your charge points to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editCP &&
          createPortal(
            <Modal onClose={() => setEdit(null)} isDark={isDark}>
              <div className="p-0">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Edit Charge Point Configuration
                  </h2>
                  <button
                    onClick={() => setEdit(null)}
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "text-zinc-400 hover:bg-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Pricing Section */}
                  <div
                    className={`p-5 rounded-xl ${
                      isDark ? "bg-black" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`font-semibold mb-4 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }`}
                        >
                          Price per kWh (€)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={tmpK}
                          onChange={(e) => setTmpK(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? "bg-black border-zinc-800 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                          placeholder="0.000"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }`}
                        >
                          Price per hour (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={tmpH}
                          onChange={(e) => setTmpH(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? "bg-black border-zinc-800 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connector Details Section */}
                  <div
                    className={`p-5 rounded-xl ${
                      isDark ? "bg-black" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`font-semibold mb-4 flex items-center gap-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Cpu className="w-5 h-5" />
                      Connector Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }`}
                        >
                          Plug Type
                        </label>
                        <select
                          value={tmpPlug}
                          onChange={(e) => setTmpPlug(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? "bg-black border-zinc-800 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                          <option value="">Select plug type</option>
                          {PLUG_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }`}
                        >
                          Max Power (kW)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={tmpPower}
                          onChange={(e) => setTmpPower(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? "bg-black border-zinc-800 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                          placeholder="e.g., 22.0"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            isDark
                              ? "text-zinc-400"
                              : "text-light-text-secondary"
                          }`}
                        >
                          Access Type
                        </label>
                        <select
                          value={tmpAccess}
                          onChange={(e) => setTmpAccess(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? "bg-black border-zinc-800 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                          <option value="">Select access type</option>
                          {ACCESS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEdit(null)}
                    className={`px-4 py-2 rounded-lg ${
                      isDark
                        ? "bg-black text-white hover:bg-zinc-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await updatePrices(editCP);
                      setEdit(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white`}
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </Modal>,
            document.body
          )}

        {/* User Management Modal */}
        {usersCP &&
          createPortal(
            <Modal onClose={() => setUsersCP(null)}>
              <div className="p-0">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Manage User Prices
                    </div>
                  </h2>
                  <button
                    onClick={() => setUsersCP(null)}
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "text-zinc-400 hover:bg-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Add User Form */}
                <div
                  className={`p-5 rounded-xl mb-6 ${
                    isDark ? "bg-black" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Add User Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-zinc-400" : "text-light-text-secondary"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-black border-zinc-800 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-zinc-400" : "text-light-text-secondary"
                        }`}
                      >
                        €/kWh
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={addK}
                        onChange={(e) => setAddK(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-black border-zinc-800 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="0.000"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-zinc-400" : "text-light-text-secondary"
                        }`}
                      >
                        €/hour
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={addH}
                        onChange={(e) => setAddH(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? "bg-black border-zinc-800 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => addUserPrice(usersCP)}
                    className={`flex items-center gap-2 px-4 py-2 mt-4 rounded-lg bg-green-600 hover:bg-green-700 text-white`}
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>

                {/* Users List */}
                <div>
                  <h3
                    className={`font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    User Pricing List
                  </h3>
                  {userRows.length === 0 ? (
                    <div
                      className={`text-center py-8 ${
                        isDark ? "text-zinc-400" : "text-light-text-secondary"
                      }`}
                    >
                      No user pricing configured yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userRows.map((user) => (
                        <div
                          key={user.id}
                          className={`p-4 rounded-xl ${
                            isDark
                              ? "bg-black"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {user.user_email}
                            </span>
                            <button
                              onClick={() => deleteUserPrice(usersCP, user.id)}
                              className={`p-2 rounded-lg ${
                                isDark
                                  ? "text-red-400 hover:bg-red-900/20"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span
                                className={
                                  isDark
                                    ? "text-zinc-400"
                                    : "text-light-text-secondary"
                                }
                              >
                                €/kWh:
                              </span>
                              <span
                                className={`ml-2 ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {user.price_per_kwh
                                  ? `€${Number(user.price_per_kwh).toFixed(3)}`
                                  : "—"}
                              </span>
                            </div>
                            <div>
                              <span
                                className={
                                  isDark
                                    ? "text-zinc-400"
                                    : "text-light-text-secondary"
                                }
                              >
                                €/hour:
                              </span>
                              <span
                                className={`ml-2 ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {user.price_per_hour
                                  ? `€${Number(user.price_per_hour).toFixed(2)}`
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Modal>,
            document.body
          )}

        {/* Portal dropdown menu */}
        {menuOpen &&
          createPortal(
            <div
              className="fixed z-50 w-52 rounded-lg shadow-lg"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
              onMouseLeave={() => setMenu(null)}
            >
              <div
                className={`w-full rounded-lg shadow-lg ${
                  isDark
                    ? "bg-black border border-zinc-800"
                    : "bg-white border border-gray-200"
                }`}
              >
                <button
                  onClick={() => {
                    const cp = cps.find((c) => c.id === menuOpen);
                    if (cp) {
                      setTmpK(cp.price_per_kwh ?? "");
                      setTmpH(cp.price_per_hour ?? "");
                      setTmpPlug(cp.plug_type ?? "");
                      setTmpPower(cp.max_power_kw ?? "");
                      setTmpAccess(cp.access_type ?? "");
                      setEdit(cp.id);
                      setMenu(null);
                    }
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-left rounded-t-lg ${
                    isDark
                      ? "text-white hover:bg-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Edit Configuration
                </button>

                <button
                  onClick={() => {
                    const cp = cps.find((c) => c.id === menuOpen);
                    if (cp) {
                      setTmpL(cp.location ?? "");
                      setTmpLat(cp.lat ?? null);
                      setTmpLng(cp.lng ?? null);
                      setLocCP(cp.id);
                      setMenu(null);
                    }
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-left ${
                    isDark
                      ? "text-white hover:bg-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Set Location
                </button>

                <button
                  onClick={async () => {
                    const cp = cps.find((c) => c.id === menuOpen);
                    if (cp) {
                      const cpKey = cp.pk ?? cp.id;
                      await loadUserPrices(cpKey);
                      setUsersCP(cpKey);
                      setMenu(null);
                    }
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-left rounded-b-lg ${
                    isDark
                      ? "text-white hover:bg-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </button>
              </div>
            </div>,
            document.body
          )}

        {/* Location Picker Modal */}
        {locCP &&
          createPortal(
            <LocationPickerModal
              address={tmpL}
              setAddress={setTmpL}
              lat={tmpLat}
              setLat={setTmpLat}
              lng={tmpLng}
              setLng={setTmpLng}
              onCancel={() => setLocCP(null)}
              onSave={async () => {
                await updateLocation(locCP);
                setLocCP(null);
              }}
            />,
            document.body
          )}
      </div>
    </DashboardLayout>
  );
}
