import { useState } from "react";
import { addresses } from "../api/client";

export default function AddAddressForm({ onAdded }: { onAdded: () => void }) {
  const [searchWord, setSearchWord] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { message, status } = await addresses.create(searchWord, name, description);
    setLoading(false);
    if (status === 200) {
      setSearchWord("");
      setName("");
      setDescription("");
      onAdded();
    } else {
      setError(message || "Impossible d'ajouter l'adresse");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-inline">
      <div className="form-group">
        <label className="label">Lieu (recherche)</label>
        <input
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Ex: Paris, 10 rue de Rivoli"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Bureau"
          required
        />
      </div>
      <div className="form-group">
        <label className="label">Description (optionnel)</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Mon bureau principal"
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Ajout…" : "Ajouter"}
      </button>
    </form>
  );
}
