import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { users } from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const createRes = await users.register(email, password);
    if (createRes.status === 200) {
      const tokenRes = await users.login(email, password);
      setLoading(false);
      if (tokenRes.data?.token) {
        login(tokenRes.data.token);
        navigate("/", { replace: true });
      }
    } else {
      setLoading(false);
      setError(createRes.message || "Impossible de créer le compte");
    }
  }

  return (
    <div className="page-center">
      <div className="glass glass-strong form-card">
        <h1>Inscription</h1>
        <p className="text-muted">Créez un compte pour enregistrer vos adresses</p>
        <form onSubmit={handleSubmit}>
            <label className="label" htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
                autoComplete="email"
            />
            <label className="label" htmlFor="password" style={{ marginTop: 12 }}>Mot de passe</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
            />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: 20, width: "100%" }} disabled={loading}>
            {loading ? "Création…" : "S'inscrire"}
          </button>
        </form>
        <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
