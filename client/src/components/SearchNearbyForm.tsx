import { useState } from "react";
import { addresses } from "../api/client";
import type { Address } from "../api/client";

export default function SearchNearbyForm({ onResults }: { onResults: (items: Address[]) => void }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("10");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const latN = parseFloat(lat);
    const lngN = parseFloat(lng);
    const radiusN = parseFloat(radius);
    if (Number.isNaN(latN) || Number.isNaN(lngN) || Number.isNaN(radiusN) || radiusN < 0) {
      setError("Lat, lng et rayon doivent être des nombres valides (rayon ≥ 0).");
      return;
    }
    setLoading(true);
    const { data, message, status } = await addresses.searchNearby({ lat: latN, lng: lngN }, radiusN);
    setLoading(false);
    if (status === 200 && data) {
      onResults(data);
    } else {
      setError(message || "Erreur lors de la recherche");
      onResults([]);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-group">
        <label className="label">Latitude</label>
        <input
          type="text"
          inputMode="decimal"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="48.8566"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Longitude</label>
        <input
          type="text"
          inputMode="decimal"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="2.3522"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Rayon (km)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          required
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Recherche…" : "Rechercher"}
      </button>
    </form>
  );
}
