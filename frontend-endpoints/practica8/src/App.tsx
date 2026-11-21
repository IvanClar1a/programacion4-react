import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UserList } from "./UserList";
import { formatRoles, getUserIdFromToken, type User } from "./types";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    setError("Tu sesión venció");
  }, []);

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    const userId = getUserIdFromToken(token);
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) return;
      const data: User = await response.json();
      setCurrentUser(data);
    });
  }, [token, handleUnauthorized]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail ?? "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    setError(null);
  }

  if (token) {
    return (
      <div className="app-container">
        <header className="topbar">
          <div>
            <h1>Gestión de Usuarios</h1>
            {currentUser && (
              <p className="greeting">
                Hola, {currentUser.name} ({formatRoles(currentUser.roles)})
              </p>
            )}
          </div>
          <button className="btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>

        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <form className="card login-form" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <label>
          Email
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}