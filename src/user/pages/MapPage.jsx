// src/user/pages/MapPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { X } from "lucide-react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), {
      padding: [40, 40],
    });
  }, [points, map]);
  return null;
}

export default function MapPage() {
  const { isDark } = useTheme();
  const [cps, setCps] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Filter UI state
  const [filterOpen, setFilterOpen] = useState(false);

  const [energyOp, setEnergyOp] = useState("any"); // any | lte | gte
  const [energyVal, setEnergyVal] = useState(""); // string input, parse to number

  const [timeOp, setTimeOp] = useState("any"); // any | lte | gte
  const [timeVal, setTimeVal] = useState("");

  const [statusSelected, setStatusSelected] = useState([]); // array of lowercased statuses

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson("/public/charge-points/");
        setCps(Array.isArray(data) ? data : []);
      } catch {
        setErr("Failed to load charge points");
      }
    })();
  }, []);

  const allPoints = useMemo(
    () =>
      (cps || [])
        .map((p) => ({
          ...p,
          lat: Number(p.lat),
          lng: Number(p.lng),
          _id: p.pk ?? p.id,
          _price_kwh: p.price_per_kwh != null ? Number(p.price_per_kwh) : NaN,
          _price_hour:
            p.price_per_hour != null ? Number(p.price_per_hour) : NaN,
          _status_lc: (p.status || "").toString().trim().toLowerCase(),
        }))
        .filter(
          (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && p._id
        ),
    [cps]
  );

  const availableStatuses = useMemo(() => {
    const s = new Set();
    for (const p of allPoints) if (p._status_lc) s.add(p._status_lc);
    // fallback common statuses if none present yet
    if (s.size === 0) {
      [
        "available",
        "preparing",
        "charging",
        "finishing",
        "unavailable",
        "faulted",
        "reserved",
        "suspendedev",
        "suspendedevse",
      ].forEach((v) => s.add(v));
    }
    return Array.from(s).sort();
  }, [allPoints]);

  const isFiltering =
    (energyOp !== "any" && energyVal.trim() !== "") ||
    (timeOp !== "any" && timeVal.trim() !== "") ||
    statusSelected.length > 0;

  const filteredPoints = useMemo(() => {
    if (!isFiltering) return allPoints;

    const eVal = Number(energyVal);
    const tVal = Number(timeVal);
    const wantEnergy = energyOp !== "any" && Number.isFinite(eVal);
    const wantTime = timeOp !== "any" && Number.isFinite(tVal);
    const wantStatus = statusSelected.length > 0;

    return allPoints.filter((p) => {
      // Price (energy)
      if (wantEnergy) {
        if (!Number.isFinite(p._price_kwh)) return false;
        if (energyOp === "lte" && !(p._price_kwh <= eVal)) return false;
        if (energyOp === "gte" && !(p._price_kwh >= eVal)) return false;
      }
      // Price (time)
      if (wantTime) {
        if (!Number.isFinite(p._price_hour)) return false;
        if (timeOp === "lte" && !(p._price_hour <= tVal)) return false;
        if (timeOp === "gte" && !(p._price_hour >= tVal)) return false;
      }
      // Status
      if (wantStatus) {
        if (!statusSelected.includes(p._status_lc)) return false;
      }
      return true;
    });
  }, [
    allPoints,
    isFiltering,
    energyOp,
    energyVal,
    timeOp,
    timeVal,
    statusSelected,
  ]);

  function toggleStatus(valLc) {
    setStatusSelected((prev) => {
      if (prev.includes(valLc)) return prev.filter((v) => v !== valLc);
      return [...prev, valLc];
    });
  }

  function clearFilters() {
    setEnergyOp("any");
    setEnergyVal("");
    setTimeOp("any");
    setTimeVal("");
    setStatusSelected([]);
  }

  return (
    <div className="h-full w-full relative">
      {/* Top-right filter button */}
      <div className="absolute top-3 right-4 z-[1000] flex items-center gap-2">
        {isFiltering && (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isDark
                ? "bg-[#213A04] text-[#ACED2E] border border-[#5AA00B]"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            Filters on ({filteredPoints.length}/{allPoints.length})
          </span>
        )}
        <button
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
            isDark
              ? "bg-[#213A04] text-white border border-[#5AA00B] hover:bg-[#539C06]"
              : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setFilterOpen(true)}
          type="button"
        >
          Filter
        </button>
        {isFiltering && (
          <button
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-gradient-to-r from-[#539C06] to-[#D7EB57] text-black hover:opacity-90"
                : "bg-gradient-to-r from-[#539C06] to-[#6BB00F] text-white hover:opacity-90"
            }`}
            type="button"
            onClick={clearFilters}
            title="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>

      {err && (
        <div
          className={`p-3 text-sm font-medium ${
            isDark ? "text-red-400" : "text-red-600"
          }`}
        >
          {err}
        </div>
      )}

      <MapContainer
        className="h-full w-full"
        center={[9.0108, 38.7613]}
        zoom={12}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={filteredPoints} />
        {filteredPoints.map((cp) => {
          const to = `/app/map/${encodeURIComponent(cp._id)}`;
          return (
            <Marker
              key={String(cp._id)}
              position={[cp.lat, cp.lng]}
              icon={markerIcon}
              eventHandlers={{ click: () => navigate(to) }}
            >
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">
                    {cp.name || cp._id}
                  </div>
                  <div className="text-sm text-gray-700">
                    Owner:{" "}
                    <span className="font-medium">
                      {cp.owner_username || "—"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    Address: {cp.location || "—"}
                  </div>
                  <div className="text-sm text-gray-700">
                    Price:{" "}
                    {Number.isFinite(cp._price_kwh) ? cp._price_kwh : "—"} €/kWh
                    · {Number.isFinite(cp._price_hour) ? cp._price_hour : "—"}{" "}
                    €/h
                  </div>
                  <div className="text-sm text-gray-700">
                    Status:{" "}
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {cp.status || "—"}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      className="text-[#539C06] hover:text-[#6BB00F] font-medium text-sm"
                      to={to}
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Filter modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`relative rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto ${
              isDark
                ? "bg-[#0f0f0e] border border-gray-800"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Filter Charge Points
            </h3>

            {/* Price (energy) */}
            <div className="mb-6">
              <label
                className={`block font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Energy Price (€/kWh)
              </label>
              <div className="flex gap-3">
                <select
                  className={`flex-1 px-4 py-2 rounded-md border transition-all duration-200 ${
                    isDark
                      ? "bg-zinc-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={energyOp}
                  onChange={(e) => setEnergyOp(e.target.value)}
                >
                  <option value="any">Any price</option>
                  <option value="lte">≤ Maximum</option>
                  <option value="gte">≥ Minimum</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    energyOp === "any"
                      ? isDark
                        ? "bg-zinc-800 border-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={energyVal}
                  onChange={(e) => setEnergyVal(e.target.value)}
                  disabled={energyOp === "any"}
                />
              </div>
            </div>

            {/* Price (time) */}
            <div className="mb-6">
              <label
                className={`block font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Time Price (€/h)
              </label>
              <div className="flex gap-3">
                <select
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isDark
                      ? "bg-zinc-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={timeOp}
                  onChange={(e) => setTimeOp(e.target.value)}
                >
                  <option value="any">Any price</option>
                  <option value="lte">≤ Maximum</option>
                  <option value="gte">≥ Minimum</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    timeOp === "any"
                      ? isDark
                        ? "bg-zinc-800 border-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-900 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                  }`}
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  disabled={timeOp === "any"}
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label
                className={`block font-medium mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Status
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                {availableStatuses.map((s) => {
                  const checked = statusSelected.includes(s);
                  const label = s.charAt(0).toUpperCase() + s.slice(1);
                  return (
                    <label
                      key={s}
                      className={`cursor-pointer flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-all duration-200 ${
                        checked
                          ? isDark
                            ? "bg-green-700 border-green-600 text-white"
                            : "bg-green-600 border-green-500 text-white"
                          : isDark
                          ? "border-gray-700 text-gray-300 hover:bg-zinc-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className={`w-4 h-4 rounded transition-colors ${
                          checked
                            ? isDark
                              ? "bg-white border-white"
                              : "bg-white border-white"
                            : isDark
                            ? "bg-zinc-800 border-gray-700"
                            : "bg-white border-gray-300"
                        }`}
                        checked={checked}
                        onChange={() => toggleStatus(s)}
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Results counter */}
            <div
              className={`flex items-center justify-between py-4 border-t ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Showing {filteredPoints.length} of {allPoints.length} charge
                points
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 bg-zinc-800 hover:bg-gray-700"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                type="button"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-green-700 text-white hover:bg-green-600"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
                type="button"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>

            {/* Close (X) */}
            <button
              className={`absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isDark
                  ? "text-gray-400 hover:bg-zinc-800 hover:text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
              onClick={() => setFilterOpen(false)}
              type="button"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
