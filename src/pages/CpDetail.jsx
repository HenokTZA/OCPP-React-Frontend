// src/pages/CpDetail.jsx
import { useEffect, useState }  from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson }             from "@/lib/api";

export default function CpDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [cp, setCp]  = useState(null);
  const [msg, setMsg]= useState(null);

  useEffect(() => {
    fetchJson(`/charge-points/${id}/`)
      .then(setCp)
      .catch(() => navigate("/"));
  }, [id]);

  async function send(action, params = {}) {
    setMsg("sending…");
    try {
      const out = await fetchJson(
        `/charge-points/${id}/command/`,
        { method: "POST", body: JSON.stringify({ action, params }) }
      );
      setMsg(`${action} → ${out.detail || "queued"}`);
    } catch (e) {
      setMsg(e.message || "error");
    }
  }

  if (!cp) return <p className="p-8">Loading…</p>;

  const ask  = q => window.prompt(q) ?? "";
  const asNum = q => Number(ask(q));

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Charge-Point {cp.id}</h1>
      {msg && <p className="text-sm text-slate-500">{msg}</p>}

      <div className="space-y-2">
        {/* existing four */}
        <button className="btn"
          onClick={() => send("ChangeAvailability",
                    { connectorId: cp.connector_id, type: "Inoperative" })}>
          ChangeAvailability (Inoperative)
        </button>

        <button className="btn"
          onClick={() => send("RemoteStartTransaction",
                    { connectorId: cp.connector_id, idTag: "demo" })}>
          RemoteStartTransaction
        </button>

        <button className="btn"
          onClick={() => send("RemoteStopTransaction",
                    { transactionId: asNum("Transaction ID?") })}>
          RemoteStopTransaction
        </button>

        <button className="btn"
          onClick={() => send("UpdateFirmware",
                    { location: "http://example.com/fw.bin",
                      retrieveDate: new Date().toISOString() })}>
          UpdateFirmware
        </button>

        <hr className="my-4" />

        {/* GetConfiguration: key must be an array */}
        <button className="btn"
          onClick={() => {
            const k = ask("Key (empty = all)?");
            const keys = k ? [k] : [];
            send("GetConfiguration", { key: keys });
          }}>
          GetConfiguration
        </button>

        {/* ChangeConfiguration stays the same */}
        <button className="btn"
          onClick={() => {
            const key   = ask("Config key?");
            const value = ask("New value?");
            if (key) send("ChangeConfiguration", { key, value });
          }}>
          ChangeConfiguration
        </button>

        {/* no payload */}
        <button className="btn"
          onClick={() => send("GetLocalListVersion")}>
          GetLocalListVersion
        </button>

        {/* demo 16 A profile */}
        <button className="btn"
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
                chargingSchedulePeriod: [{ startPeriod: 0, limit: 16 }]
              }
            };
            send("SetChargingProfile", {
              connectorId: cp.connector_id,
              csChargingProfiles: profile
            });
          }}>
          SetChargingProfile (16 A demo)
        </button>

        {/* ClearChargingProfile */}
        <button className="btn"
          onClick={() => send("ClearChargingProfile",
                    { id: asNum("Profile ID (0 = all)?") || 0 })}>
          ClearChargingProfile
        </button>

        {/* GetCompositeSchedule: use camelCase connectorId */}
        <button className="btn"
          onClick={() => send("GetCompositeSchedule", {
            connectorId: cp.connector_id,
            duration: asNum("Horizon in seconds?") || 3600
          })}>
          GetCompositeSchedule
        </button>
      </div>
    </div>
  );
}

