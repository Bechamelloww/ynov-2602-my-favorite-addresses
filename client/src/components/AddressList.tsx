import type { Address } from "../api/client";

export default function AddressList({ addresses }: { addresses: Address[] }) {
  if (addresses.length === 0) {
    return (
      <p className="text-muted" style={{ margin: 0 }}>
        Aucune adresse.
      </p>
    );
  }
  return (
    <ul className="address-list">
      {addresses.map((a) => (
        <li key={a.id} className="glass address-item">
          <strong>{a.name}</strong>
          {a.description && <p className="text-muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{a.description}</p>}
          <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.8 }}>
            {a.lat.toFixed(5)}, {a.lng.toFixed(5)}
          </p>
        </li>
      ))}
    </ul>
  );
}
