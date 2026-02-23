import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { users } from "../api/client";

export default function Login() {
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
    const { data, message, status } = await users.login(email, password);
    setLoading(false);
    if (status === 200 && data?.token) {
      login(data.token);
      navigate("/", { replace: true });
    } else {
      setError(message || "Identifiants incorrects");
    }
  }

  return (
    <div className="page-center">
      <div className="glass glass-strong form-card">
        <h1>Connexion</h1>
        <p className="text-muted">Accédez à vos adresses favorites</p>
        <form onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
            autoComplete="email"
          />
          <label className="label" style={{ marginTop: 12 }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: 20, width: "100%" }} disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
