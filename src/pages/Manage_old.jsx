// src/pages/Manage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const fmt = d => (d ? new Date(d).toLocaleString() : "—");

export default function Manage() {
  const { logout } = useAuth();
  const [me, setMe]   = useState(null);
  const [cps, setCps] = useState(null);
  const [err, setErr] = useState("");

  // Load me
  useEffect(() => {
    fetchJson("/me")
      .then(setMe)
      .catch(() => logout());
  }, [logout]);

  // Load + poll CPs
  useEffect(() => {
    const load = () => fetchJson("/charge-points/").then(setCps).catch(() => setErr("Failed to load charge points"));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  if (!me) return <div className="p-6">Loading…</div>;
  if (!me.tenant_ws) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Manage</h1>
        <p>You don’t own a tenant yet.</p>
        <Link className="btn" to="/">← Back to dashboard</Link>
      </div>
    );
  }
  if (!cps) return <div className="p-6">Loading charge-points…</div>;

  const wsUrl = me.tenant_ws.replace(/^ws:\/\/[^/]+/, "ws://147.93.127.215:9000");

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage</h1>
        <Link className="btn" to="/">← Back to dashboard</Link>
      </div>

      {/* WebSocket URL */}
      <section>
        <h2 className="text-lg font-medium mb-2">Connect your charge-points to:</h2>
        <code className="block p-2 bg-slate-100 rounded break-all">{wsUrl}</code>
      </section>

      {/* Charge-points list */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Your charge-points</h2>
          {err && <div className="text-sm text-red-600">{err}</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 pr-2">ID</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2">Conn</th>
                <th className="py-2 pr-2">Updated</th>
                <th className="py-2 pr-2 text-right">€/kWh</th>
                <th className="py-2 pr-2 text-right">€/h</th>
              </tr>
            </thead>
            <tbody>
              {cps.map(cp => {
                const fmtPrice = v => (v == null ? "—" : Number(v).toFixed(3));
                const fmtHour  = v => (v == null ? "—" : Number(v).toFixed(2));
                return (
                  <tr key={cp.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td
                      className="py-2 pr-2 cursor-pointer text-blue-700"
                      title="Open details"
                      onClick={() => (location.href = `/cp/${cp.id}`)}
                    >
                      {cp.id}
                    </td>
                    <td className="py-2 pr-2">{cp.status}</td>
                    <td className="py-2 pr-2">{cp.connector_id}</td>
                    <td className="py-2 pr-2">{fmt(cp.updated)}</td>
                    <td className="py-2 pr-2 text-right">{fmtPrice(cp.price_per_kwh)}</td>
                    <td className="py-2 pr-2 text-right">{fmtHour(cp.price_per_hour)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}



