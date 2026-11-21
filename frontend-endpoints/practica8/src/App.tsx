import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UserList } from "./UserList";
import { formatRoles, type User } from "./types";

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

    async function loadCurrentUser() {
      try {
        const meResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meResponse.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!meResponse.ok) return;
        const { id }: { id: number } = await meResponse.json();

        const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!userResponse.ok) return;
        const data: User = await userResponse.json();
        setCurrentUser(data);
      } catch {
        // Error de red manejado en UserList
      }
    }

    loadCurrentUser();
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