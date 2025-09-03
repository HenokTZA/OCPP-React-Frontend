import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import {
  MapPin,
  Navigation,
  Zap,
  Clock,
  User,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Wifi,
  Battery,
  Car,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import UserLoadingSpinner from "../../components/UserLoadingSpinner";

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function NearbyPage() {
  const { isDark } = useTheme();
  const [me, setMe] = useState(null);
  const [cps, setCps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getLocation = () => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        setMe(null);
        setError("Location access denied. Showing all stations unsorted.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const fetchChargePoints = async () => {
    try {
      setRefreshing(true);
      const data = await fetchJson("/charge-points/");
      setCps(data.filter((p) => p.lat != null && p.lng != null));
      setLoading(false);
    } catch (err) {
      setError("Failed to load charging stations");
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChargePoints();
  }, []);

  const list =
    me && cps.length
      ? cps
          .map((p) => ({
            ...p,
            _dist: haversineKm(me.lat, me.lng, Number(p.lat), Number(p.lng)),
          }))
          .sort((a, b) => a._dist - b._dist)
      : cps;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-500";
      case "charging":
        return "bg-amber-500";
      case "unavailable":
        return "bg-rose-500";
      case "offline":
        return "bg-neutral-500";
      default:
        return "bg-neutral-400";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "Available";
      case "charging":
        return "Charging";
      case "unavailable":
        return "Unavailable";
      case "offline":
        return "Offline";
      default:
        return status || "Unknown";
    }
  };

  const openInMaps = (lat, lng) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <UserLoadingSpinner
        message="Loading charging stations..."
        isDark={isDark}
      />
    );
  }

  return (
    <div className={`h-full p-6 space-y-6`}>
      <div className="w-full space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={getLocation}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            } shadow-sm`}
          >
            <Navigation className="w-4 h-4" />
            Refresh Location
          </button>

          <button
            onClick={fetchChargePoints}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            } shadow-sm`}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Stations
          </button>
        </div>

        {error && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              isDark
                ? "bg-amber-900/20 text-amber-300"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                Total Stations
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {list.length}
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Available
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {
                list.filter((p) => p.status?.toLowerCase() === "available")
                  .length
              }
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Car
                className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                In Use
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {
                list.filter((p) => p.status?.toLowerCase() === "charging")
                  .length
              }
            </p>
          </div>

          <div
            className={`p-5 rounded-xl ${
              isDark ? "bg-[#0f0f0e]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin
                className={`w-5 h-5 ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Nearest
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              {list[0]?._dist ? `${list[0]._dist.toFixed(1)} km` : "—"}
            </p>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl overflow-hidden transition-all ${
                isDark
                  ? "bg-[#0f0f0e] border-neutral-800"
                  : "bg-white border-neutral-200"
              } border shadow-sm hover:shadow-md`}
            >
              <div className="p-5">
                {/* Station Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      className={`font-semibold text-lg mb-1 ${
                        isDark ? "text-white" : "text-neutral-800"
                      }`}
                    >
                      {p.name || `Station ${p.id.slice(-4)}`}
                    </h3>
                    {p._dist !== undefined && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span
                          className={`text-xs ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {p._dist.toFixed(1)} km away
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        isDark ? "bg-opacity-20 text-white" : "text-neutral-800"
                      } ${getStatusColor(p.status)}`}
                    >
                      {getStatusText(p.status)}
                    </span>
                    {p.connector_type && (
                      <span
                        className={`text-xs mt-1 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {p.connector_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Station Details */}
                <div className="space-y-3">
                  {p.location && (
                    <div className="flex items-start gap-2">
                      <MapPin
                        className={`w-4 h-4 mt-0.5 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {p.location}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    {p.price_per_kwh && (
                      <div className="flex items-center gap-2">
                        <DollarSign
                          className={`w-4 h-4 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {p.price_per_kwh} €/kWh
                        </span>
                      </div>
                    )}

                    {p.price_per_hour && (
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`w-4 h-4 ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isDark ? "text-neutral-400" : "text-neutral-600"
                          }`}
                        >
                          {p.price_per_hour} €/h
                        </span>
                      </div>
                    )}
                  </div>

                  {p.owner_username && (
                    <div className="flex items-center gap-2">
                      <User
                        className={`w-4 h-4 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        Operated by {p.owner_username}
                      </span>
                    </div>
                  )}

                  {p.power && (
                    <div className="flex items-center gap-2">
                      <Battery
                        className={`w-4 h-4 ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-neutral-400" : "text-neutral-600"
                        }`}
                      >
                        {p.power} kW
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => openInMaps(p.lat, p.lng)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#267516] hover:bg-[#106100] text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>

                  {/* <button
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isDark
                        ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    Details
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && !loading && (
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
              No charging stations found
            </h3>
            <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
              Try adjusting your search or check back later for new stations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
