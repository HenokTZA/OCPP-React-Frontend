import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import Modal from "./ui/Modal.jsx";
import Field from "./ui/Field.jsx";
import ModalButton from "./ui/ModalButton.jsx";

export default function LocationPickerModal({
  address,
  setAddress,
  lat,
  setLat,
  lng,
  setLng,
  onCancel,
  onSave,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // prevent double init & ensure container exists
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

    // keep modal clicks from closing backdrop
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

    // sizing fix after mount
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

  return (
    <Modal onClose={onCancel}>
      <div className="mb-6 rounded space-y-3">
        <Field
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={geocodeFromInput}
        />
        <div
          ref={mapDivRef}
          className="rounded"
          style={{ height: 380, width: "100%" }}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" value={lat ?? ""} readOnly />
          <Field label="Longitude" value={lng ?? ""} readOnly />
        </div>
        <p className="text-xs text-slate-500">
          Search, click the map, or drag the pin. We’ll save this address (and
          coordinates if supported).
        </p>
      </div>
      <ModalButton onCancel={onCancel} onSave={onSave} />
    </Modal>
  );
}
