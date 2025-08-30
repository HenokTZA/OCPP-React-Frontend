// src/pages/SessionsHistory.jsx
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

export default function SessionsHistory() {
  const [rows, setRows] = useState([]);
  const [cps, setCps]   = useState([]);
  const [page, setPage] = useState(1);
  const pageSize        = 25;
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    Promise.all([
      fetchJson(`/sessions/?page=${page}&page_size=${pageSize}`),
      fetchJson(`/charge-points/`)
    ])
      .then(([res, c]) => {
        if (cancel) return;
        setRows(res.results || res);           // support paginated or plain list
        setCount(res.count ?? null);
        setCps(c || []);
      })
      .finally(() => !cancel && setLoading(false));
    return () => { cancel = true; };
  }, [page]);

  const money = n => `€${Number(n || 0).toFixed(2)}`;
  const findCp = id => cps.find(cp =>
    String(cp.id ?? cp.pk) === String(id)
  );

  function totalFor(s) {
    // If backend provides total, prefer it
    if (s.total_eur != null) return Number(s.total_eur);

    const cp = findCp(s.cp ?? s.cp_id);
    if (!cp) return 0;

    const kwh = Number(s.kWh ?? s.kwh ?? 0);
    const byEnergy = (Number(cp.price_per_kwh) || 0) * kwh;

    let byTime = 0;
    const start = s.Started || s.started;
    const end   = s.Ended   || s.ended;
    if (cp.price_per_hour && start && end) {
      const hours = Math.max(0, (new Date(end) - new Date(start)) / 36e5);
      byTime = hours * Number(cp.price_per_hour);
    }
    return byEnergy + byTime;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sessions history</h1>

      {loading ? <div>Loading…</div> : (
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th>ID</th><th>CP</th><th>kWh</th>
              <th>Started</th><th>Stopped</th>
              <th className="text-right">Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(s => {
              const k = Number(s.kWh ?? s.kwh ?? 0);
              return (
                <tr key={s.id} className="border-b last:border-0">
                  <td>{s.id}</td>
                  <td>{s.cp ?? s.cp_id}</td>
                  <td>{k.toFixed(3)}</td>
                  <td>{s.Started || s.started ? new Date(s.Started || s.started).toLocaleString() : "—"}</td>
                  <td>{s.Ended   || s.ended   ? new Date(s.Ended   || s.ended).toLocaleString()   : "—"}</td>
                  <td className="text-right">{money(totalFor(s))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* simple pager */}
      {count != null && (
        <div className="mt-4 flex gap-2">
          <button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <button className="btn" disabled={rows.length < pageSize} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

