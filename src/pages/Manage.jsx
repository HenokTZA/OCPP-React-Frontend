// src/pages/Manage.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { fetchJson } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// Leaflet + geocoder
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/* helpers */
const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");
const patchCP = (id, body) =>
  fetchJson(`/charge-points/${id}/`, { method: "PATCH", body: JSON.stringify(body) });

export default function Manage() {
  const { logout } = useAuth();
  const [me, setMe] = useState(null);
  const [cps, setCps] = useState(null);
  const [err, setErr] = useState("");

  // menu / modals state
  const [menuOpen, setMenu] = useState(null); // cp.id or null
  const [editCP, setEdit] = useState(null); // cp.id or null
  const [locCP, setLocCP] = useState(null); // cp.id or null

  // temp fields inside modals
  const [tmpK, setTmpK] = useState("");
  const [tmpH, setTmpH] = useState("");
  const [tmpL, setTmpL] = useState("");
  const [tmpLat, setTmpLat] = useState(null);
  const [tmpLng, setTmpLng] = useState(null);

  const [usersCP, setUsersCP] = useState(null);   // cp.id that is being managed
const [userRows, setUserRows] = useState([]);   // [{id, user_email, price_per_kwh, price_per_hour, editing}]
const [addEmail, setAddEmail] = useState("");
const [addK, setAddK] = useState("");
const [addH, setAddH] = useState("");



  // Options
const PLUG_OPTIONS = [
  { value: "type2",   label: "Type 2" },
  { value: "eu",      label: "EU Schuko" },
  { value: "uk",      label: "UK" },
  { value: "swiss",   label: "Swiss" },
  { value: "ccs2",    label: "CCS2" },
  { value: "chademo", label: "CHAdeMO" },
];

const ACCESS_OPTIONS = [
  { value: "public",  label: "Public" },
  { value: "limited", label: "Limited" },
  { value: "private", label: "Private" },
];

// NEW temp fields
const [tmpPlug,   setTmpPlug]   = useState("");
const [tmpPower,  setTmpPower]  = useState("");   // kW
const [tmpAccess, setTmpAccess] = useState("");




  useEffect(() => {
    fetchJson("/me")
      .then(setMe)
      .catch(() => logout());
  }, [logout]);

  useEffect(() => {
    const load = () =>
      fetchJson("/charge-points/")
        .then(setCps)
        .catch(() => setErr("Failed to load charge points"));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

/*
  async function updatePrices(id) {
    const pk = Number(tmpK) || 0;
    const ph = Number(tmpH) || 0;
    await patchCP(id, { price_per_kwh: pk, price_per_hour: ph });
    setCps((arr) => arr.map((c) => (c.id === id ? { ...c, price_per_kwh: pk, price_per_hour: ph } : c)));
  }
*/


async function updatePrices(id) {
  const pk = Number(tmpK) || 0;
  const ph = Number(tmpH) || 0;

  const body = {
    price_per_kwh:  pk,
    price_per_hour: ph,
    plug_type:      tmpPlug || null,                          // "type2", "eu", ...
    max_power_kw:   tmpPower === "" ? null : Number(tmpPower),// number (kW)
    access_type:    tmpAccess || null,                        // "public" | "limited" | "private"
  };

  await patchCP(id, body);

  setCps(arr =>
    arr.map(c =>
      (c.id === id || c.pk === id) ? { ...c, ...body } : c
    )
  );
}


async function loadUserPrices(cpId) {
  const rows = await fetchJson(`/charge-points/${cpId}/user-prices/`);
  setUserRows((rows || []).map(r => ({ ...r, editing: false })));
}

async function addUserPrice(cpId) {
  const body = {
    email: addEmail.trim(),
    price_per_kwh:  addK === "" ? null : Number(addK),
    price_per_hour: addH === "" ? null : Number(addH),
  };
  const row = await fetchJson(`/charge-points/${cpId}/user-prices/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  setUserRows(arr => [...arr, { ...row, editing: false }]);
  setAddEmail(""); setAddK(""); setAddH("");
}

async function patchUserPrice(cpId, upid, patch) {
  const row = await fetchJson(`/charge-points/${cpId}/user-prices/${upid}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  setUserRows(arr => arr.map(x => x.id === upid ? { ...row, editing: false } : x));
}

async function deleteUserPrice(cpId, upid) {
  await fetchJson(`/charge-points/${cpId}/user-prices/${upid}/`, { method: "DELETE" });
  setUserRows(arr => arr.filter(x => x.id !== upid));
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

  if (!me) return <div className="p-6">Loading…</div>;
  if (!me.tenant_ws)
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Manage</h1>
        <p>You don’t own a tenant yet.</p>
        <Link className="btn" to="/">← Back to dashboard</Link>
      </div>
    );
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

      {/* Charge-points list + ⋮ menu */}
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
                <th className="py-2 pr-2"></th>
              </tr>
            </thead>
            <tbody>
              {cps.map((cp) => {
                const fmtPrice = (v) => (v == null ? "—" : Number(v).toFixed(3));
                const fmtHour = (v) => (v == null ? "—" : Number(v).toFixed(2));
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
                    <td className="py-2 pr-2 relative">
                      <button
                        className="px-2 text-lg"
                        onClick={() => setMenu((m) => (m === cp.id ? null : cp.id))}
                        aria-label="Open actions"
                      >
                        ⋮
                      </button>

                      {menuOpen === cp.id && (
                        <ul
                          className="absolute right-0 z-10 mt-1 w-48 bg-white border rounded shadow"
                          onMouseLeave={() => setMenu(null)}
                        >
                          <Li
                            label="✏️  Edit connector"
                            cb={() => {
                              setTmpK(cp.price_per_kwh ?? "");
                              setTmpH(cp.price_per_hour ?? "");
                              setTmpPlug(cp.plug_type ?? "");
                              setTmpPower(cp.max_power_kw ?? "");
                              setTmpAccess(cp.access_type ?? "");
                              setEdit(cp.id);
                              setMenu(null);
                            }}
                          />
                          <Li
                            label="📍 Set location"
                            cb={() => {
                              setTmpL(cp.location ?? "");
                              setTmpLat(cp.lat ?? null);
                              setTmpLng(cp.lng ?? null);
                              setLocCP(cp.id);
                              setMenu(null);
                            }}
                          />
                          <Li
  label="👥 Define users"
  cb={async () => {
    const cpKey = cp.pk ?? cp.id;    // "BURA"
    await loadUserPrices(cpKey);
    setUsersCP(cpKey);
    setMenu(null);
  }}
/>





                          <Li label="🗓️  Define times" disabled />
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Price modal */}
/*     {editCP &&

        createPortal(
          <Modal onClose={() => setEdit(null)}>
            <h2 className="text-xl font-semibold mb-4">Edit connector</h2>
            <div className="mb-6 p-4 rounded shadow border">
              <h3 className="font-medium mb-4">Prices</h3>
              <div className="grid grid-cols-2 gap-6">
                <Field label="Price per kWh (€)" value={tmpK} onChange={(e) => setTmpK(e.target.value)} />
                <Field label="Price per h  (€)" value={tmpH} onChange={(e) => setTmpH(e.target.value)} />
              </div>
            </div>
            <ModalButtons
              onCancel={() => setEdit(null)}
              onSave={async () => {
                await updatePrices(editCP);
                setEdit(null);
              }}
            />
          </Modal>,
          document.body
        )}
*/

{usersCP !== null && (
  <UserPricesModal
    cpId={usersCP}
    rows={userRows}
    setRows={setUserRows}
    addEmail={addEmail}
    setAddEmail={setAddEmail}
    addK={addK}
    setAddK={setAddK}
    addH={addH}
    setAddH={setAddH}
    onAdd={addUserPrice}
    onPatch={patchUserPrice}
    onDelete={deleteUserPrice}
    onClose={() => { setUsersCP(null); setUserRows([]); }}
  />
)}




{editCP &&
  createPortal(
    <Modal onClose={() => setEdit(null)}>
      <h2 className="text-xl font-semibold mb-4">Edit connector</h2>

      {/* Prices */}
      <div className="mb-6 p-4 rounded shadow border">
        <h3 className="font-medium mb-4">Prices</h3>
        <div className="grid grid-cols-2 gap-6">
          <Field
            label="Price per kWh (€)"
            value={tmpK}
            onChange={(e) => setTmpK(e.target.value)}
          />
          <Field
            label="Price per h  (€)"
            value={tmpH}
            onChange={(e) => setTmpH(e.target.value)}
          />
        </div>
      </div>

      {/* Connector & Access */}
      <div className="mb-6 p-4 rounded shadow border">
        <h3 className="font-medium mb-4">Connector &amp; Access</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Plug type */}
          <label className="block">
            <span className="text-sm text-slate-600">Plug type</span>
            <select
              className="mt-1 w-full border-b outline-none focus:border-blue-500 py-1 bg-white"
              value={tmpPlug}
              onChange={(e) => setTmpPlug(e.target.value)}
            >
              <option value="">— Select —</option>
              {PLUG_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>

          {/* Max power (kW) */}
          <Field
            label="Max power (kW)"
            value={tmpPower}
            onChange={(e) => setTmpPower(e.target.value)}
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 22"
          />

          {/* Access type */}
          <label className="block">
            <span className="text-sm text-slate-600">Access type</span>
            <select
              className="mt-1 w-full border-b outline-none focus:border-blue-500 py-1 bg-white"
              value={tmpAccess}
              onChange={(e) => setTmpAccess(e.target.value)}
            >
              <option value="">— Select —</option>
              {ACCESS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          These settings are saved on the charge point record.
        </p>
      </div>

      <ModalButtons
        onCancel={() => setEdit(null)}
        onSave={async () => {
          await updatePrices(editCP);
          setEdit(null);
        }}
      />
    </Modal>,
    document.body
  )
}


      {/* Location modal */}
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
  );
}


          
            



/* small presentational helpers */
const Li = ({ label, cb, disabled }) => (
  <li>
    <button
      disabled={disabled}
      onClick={cb}
      className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 disabled:text-slate-400"
    >
      {label}
    </button>
  </li>
);

const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-20 flex items-center justify-center bg-black/30"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose?.();
    }}
  >
    <div className="max-h-[90vh] w-[34rem] overflow-y-auto bg-white rounded shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, ...rest }) => (
  <label className="block">
    <span className="text-sm text-slate-600">{label}</span>
    <input
      className="mt-1 w-full border-b outline-none focus:border-blue-500 py-1"
      value={value}
      onChange={onChange}
      {...rest}
    />
  </label>
);

/* Map modal used for setting address/coords */
function LocationPickerModal({ address, setAddress, lat, setLat, lng, setLng, onCancel, onSave }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    if (!mapDivRef.current.isConnected) return;

    const start = [lat ?? 46.948, lng ?? 7.4474]; // Bern fallback
    const map = L.map(mapDivRef.current, {
      zoomControl: true,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      inertia: false,
    }).setView(start, lat && lng ? 15 : 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    L.DomEvent.disableClickPropagation(mapDivRef.current);
    L.DomEvent.disableScrollPropagation(mapDivRef.current);

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: L.Control.Geocoder.nominatim(),
    })
      .on("markgeocode", (e) => {
        const c = e.geocode.center;
        placeMarker(c.lat, c.lng);
        setAddress(e.geocode.name ?? address);
        if (mapRef.current) mapRef.current.setView(c, 16);
      })
      .addTo(map);

    map.on("click", (e) => placeMarker(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      try {
        geocoder.off();
      } catch {}
      try {
        markerRef.current?.remove();
      } catch {}
      try {
        map.off();
      } catch {}
      try {
        map.remove();
      } catch {}
      markerRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, lat, lng, setAddress]);

  function placeMarker(a, b) {
    const map = mapRef.current;
    if (!map) return;
    if (!markerRef.current) {
      const mk = L.marker([a, b], { draggable: true }).addTo(map);
      mk.on("dragend", () => {
        const p = mk.getLatLng();
        setLat(Number(p.lat.toFixed(6)));
        setLng(Number(p.lng.toFixed(6)));
        reverse(p.lat, p.lng);
      });
      markerRef.current = mk;
    } else {
      markerRef.current.setLatLng([a, b]);
    }
    setLat(Number(a.toFixed(6)));
    setLng(Number(b.toFixed(6)));
    reverse(a, b);
  }

  function reverse(a, b) {
    const nominatim = L.Control.Geocoder.nominatim();
    nominatim.reverse({ lat: a, lng: b }, 18, (res) => {
      if (res?.[0]?.name) setAddress(res[0].name);
    });
  }

  function geocodeFromInput(e) {
    if (e.key !== "Enter" || !mapRef.current) return;
    e.preventDefault();
    const nominatim = L.Control.Geocoder.nominatim();
    nominatim.geocode(address, (results) => {
      const c = results?.[0]?.center || results?.[0]?.bbox?.getCenter?.();
      if (c && mapRef.current) {
        placeMarker(c.lat, c.lng);
        mapRef.current.setView(c, 16);
      }
    });
  }

  return createPortal(
    <Modal onClose={onCancel}>
      <h2 className="text-xl font-semibold mb-4">Set location</h2>
      <div className="mb-6 p-4 rounded shadow border space-y-3">
        <Field label="Address" value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={geocodeFromInput} />
        <div ref={mapDivRef} className="rounded" style={{ height: 380, width: "100%" }} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" value={lat ?? ""} readOnly />
          <Field label="Longitude" value={lng ?? ""} readOnly />
        </div>
        <p className="text-xs text-slate-500">Search, click the map, or drag the pin. We’ll save this address (and coordinates if supported).</p>
      </div>
      <ModalButtons onCancel={onCancel} onSave={onSave} />
    </Modal>,
    document.body
  );
}

const ModalButtons = ({ onCancel, onSave }) => (
  <div className="flex justify-end gap-3">
    <button className="px-4 py-1.5 rounded bg-slate-100" onClick={onCancel}>
      Cancel
    </button>
    <button className="px-4 py-1.5 rounded bg-blue-600 text-white" onClick={onSave}>
      Save
    </button>
  </div>
);

function UserPricesModal({
  cpId,
  rows, setRows,
  addEmail, setAddEmail,
  addK, setAddK,
  addH, setAddH,
  onAdd, onPatch, onDelete,
  onClose,
}) {
  return createPortal(
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User management</h2>

        <div className="flex items-end gap-2">
          <div>
            <div className="text-xs opacity-70 mb-1">e-mail</div>
            <input
              className="input input-bordered"
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              placeholder="user@email.com"
            />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Price per kWh</div>
            <input
              className="input input-bordered w-28"
              value={addK}
              onChange={e => setAddK(e.target.value)}
              placeholder="e.g. 0.35"
            />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Price per h</div>
            <input
              className="input input-bordered w-28"
              value={addH}
              onChange={e => setAddH(e.target.value)}
              placeholder="e.g. 1.20"
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={!addEmail.trim()}
            onClick={() => onAdd(cpId)}
          >
            + Add user
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th>e-mail</th>
              <th>Price per kWh</th>
              <th>Price per h</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-b last:border-0">
                <td>{row.user_email}</td>
                <td>
                  {row.editing ? (
                    <input
                      className="input input-bordered w-28"
                      defaultValue={row.price_per_kwh ?? ""}
                      onChange={e => row._k = e.target.value}
                    />
                  ) : (
                    <span>{Number(row.price_per_kwh ?? 0).toFixed(3)} CHF</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      className="input input-bordered w-28"
                      defaultValue={row.price_per_hour ?? ""}
                      onChange={e => row._h = e.target.value}
                    />
                  ) : (
                    <span>{Number(row.price_per_hour ?? 0).toFixed(2)} CHF</span>
                  )}
                </td>
                <td className="text-right">
                  {!row.editing ? (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setRows(arr => arr.map(x =>
                            x.id === row.id ? { ...x, editing: true } : x
                          ))
                        }
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => onDelete(cpId, row.id)}
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setRows(arr => arr.map(x =>
                            x.id === row.id ? { ...x, editing: false } : x
                          ))
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          const patch = {
                            price_per_kwh:  row._k === undefined || row._k === "" ? null : Number(row._k),
                            price_per_hour: row._h === undefined || row._h === "" ? null : Number(row._h),
                          };
                          onPatch(cpId, row.id, patch);
                        }}
                      >
                        Save
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </Modal>,
    document.body
  );
}

  
              
             

