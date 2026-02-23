import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Address } from "../api/client";
import "leaflet/dist/leaflet.css";

const defaultCenter: [number, number] = [46.603354, 1.888334]; // France
const defaultZoom = 6;

function FitBounds({ addresses }: { addresses: Address[] }) {
  const map = useMap();
  useEffect(() => {
    if (addresses.length === 0) return;
    const bounds = L.latLngBounds(addresses.map((a) => [a.lat, a.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, addresses]);
  return null;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AddressMap({ addresses }: { addresses: Address[] }) {
  return (
    <div className="map-wrapper glass">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="address-map"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {addresses.length > 0 && <FitBounds addresses={addresses} />}
        {addresses.map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={markerIcon}>
            <Popup>
              <strong>{a.name}</strong>
              {a.description && <><br /><span className="text-muted">{a.description}</span></>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
