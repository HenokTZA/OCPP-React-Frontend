// src/pages/SessionsHistory.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api";
import { Link } from "react-router-dom";

const PAGE_SIZE = 50;
const fmt = d => (d ? new Date(d).toLocaleString() : "—");

export default function SessionsHistory() {
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canPrev = offset > 0;
  const canNext = rows.length === PAGE_SIZE; // if we got a full page, assume next exists

  async function load(pageOffset = 0) {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchJson(`/sessions/?limit=${PAGE_SIZE}&offset=${pageOffset}`);
      setRows(Array.isArray(data) ? data : []);
      setOffset(pageOffset);
    } catch {
      setErr("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(0);
  }, []);

  const total = useMemo(() => {
    // If your serializer exposes total price directly, use it.
    // Otherwise this stays as a dash column on the Dashboard and history.
    return null;
  }, [rows]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sessions History</h1>
        <Link to="/" className="btn">Back to Dashboard</Link>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="text-left border-b bg-slate-50">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">CP</th>
              <th className="p-2">kWh</th>
              <th className="p-2">Started</th>
              <th className="p-2">Stopped</th>
              <th className="p-2 text-right">Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr><td className="p-3 text-slate-500" colSpan={6}>No sessions</td></tr>
            )}
            {rows.map(s => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.cp}</td>
                <td className="p-2">{Number(s.kWh ?? 0).toFixed(3)}</td>
                <td className="p-2">{fmt(s.Started)}</td>
                <td className="p-2">{fmt(s.Ended)}</td>
                <td className="p-2 text-right">
                  {/* If your serializer returns total_price, render it; else show "—" */}
                  {typeof s.total_price === "number" ? s.total_price.toFixed(2) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {rows.length} rows · offset {offset}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            disabled={!canPrev || loading}
            onClick={() => load(Math.max(0, offset - PAGE_SIZE))}
          >
            ‹ Prev
          </button>
          <button
            className="btn btn-outline"
            disabled={!canNext || loading}
            onClick={() => load(offset + PAGE_SIZE)}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}

