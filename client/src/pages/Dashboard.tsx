import { useEffect, useState } from "react";
import { addresses, type Address } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import AddressList from "../components/AddressList";
import AddAddressForm from "../components/AddAddressForm";
import SearchNearbyForm from "../components/SearchNearbyForm";
import AddressMap from "../components/AddressMap";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyResults, setNearbyResults] = useState<Address[] | null>(null);

  async function loadAddresses() {
    setLoading(true);
    const { data } = await addresses.list();
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <>
      <div className="bg-animation" aria-hidden />
      <div className="dashboard">
        <header className="glass dashboard-header">
          <div>
            <h1>Mes adresses favorites</h1>
            <p className="text-muted">{user?.email}</p>
          </div>
          <button type="button" className="btn-ghost" onClick={logout}>
            Déconnexion
          </button>
        </header>

        <main className="dashboard-main">
          <section className="glass section-card bento-map">
            <h2>Carte</h2>
            <p className="text-muted">Adresses enregistrées en base</p>
            <AddressMap addresses={items} />
          </section>

          <section className="glass section-card bento-add">
            <h2>Ajouter une adresse</h2>
            <p className="text-muted">Lieu, nom, description.</p>
            <AddAddressForm onAdded={loadAddresses} />
          </section>

          <section className="glass section-card bento-search">
            <h2>À proximité</h2>
            <p className="text-muted">Rayon (km) autour d’un point.</p>
            <SearchNearbyForm onResults={setNearbyResults} />
            {nearbyResults !== null && (
              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: "0.9rem", marginBottom: 6 }}>
                  {nearbyResults.length} adresse(s)
                </h3>
                <AddressList addresses={nearbyResults} />
              </div>
            )}
          </section>

          <section className="glass section-card bento-list">
            <h2>Mes adresses</h2>
            {loading ? (
              <p className="text-muted">Chargement…</p>
            ) : (
              <AddressList addresses={items} />
            )}
          </section>
        </main>
      </div>
    </>
  );
}
