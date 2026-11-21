import { useEffect, useState, type FormEvent } from "react";
import { formatCountry, formatRoles, type User } from "./types";

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [onlyAdults, setOnlyAdults] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  async function fetchUsers(endpoint: string) {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await respuesta.json();
      if (!respuesta.ok) {
        setError(data.detail ?? "Error al cargar usuarios");
        return;
      }
      setUsers(data);
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers("/user");
  }, [token]);

  useEffect(() => {
    if (selectedId === null) return;

    async function loadUserDetail() {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setDetailError(data.detail ?? "Error al cargar el detalle");
          return;
        }
        setSelectedUser(data);
      } catch {
        setDetailError("No se pudo conectar con el servidor");
      } finally {
        setDetailLoading(false);
      }
    }

    loadUserDetail();
  }, [selectedId, token]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const term = search.trim();
    setOnlyAdults(false);
    if (!term) {
      fetchUsers("/user");
      return;
    }
    fetchUsers(`/user/search/${encodeURIComponent(term)}`);
  }

  function handleClear() {
    setSearch("");
    setOnlyAdults(false);
    fetchUsers("/user");
  }

  function handleToggleAdults() {
    const nextValue = !onlyAdults;
    setOnlyAdults(nextValue);
    setSearch("");
    fetchUsers(nextValue ? "/user_mayores" : "/user");
  }

  async function handleDeleteUser(user: User) {
    const confirmed = window.confirm(`¿Seguro que querés borrar a ${user.name}?`);
    if (!confirmed) return;

    setDeleteError(null);

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!respuesta.ok) {
        const data = await respuesta.json().catch(() => ({}));
        setDeleteError(data.detail ?? "Error al borrar usuario");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedId === user.id) {
        setSelectedId(null);
        setSelectedUser(null);
      }
    } catch {
      setDeleteError("No se pudo conectar con el servidor");
    }
  }

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    setCreating(true);

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          password,
          country_id: Number(countryId),
        }),
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        setCreateError(data.detail ?? "Error al crear usuario");
        return;
      }

      setCreateSuccess("Usuario creado correctamente");
      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
      setSearch("");
      await fetchUsers(onlyAdults ? "/user_mayores" : "/user");
    } catch {
      setCreateError("No se pudo conectar con el servidor");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="content-grid">
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <h2 style={{ margin: 0 }}>Usuarios</h2>
            <button
              type="button"
              className={onlyAdults ? "" : "btn-secondary"}
              onClick={handleToggleAdults}
            >
              {onlyAdults ? "Solo mayores" : "Todos"}
            </button>
          </div>

          <form className="toolbar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Buscar</button>
            <button type="button" className="btn-secondary" onClick={handleClear}>
              Limpiar
            </button>
          </form>

          {deleteError && <p className="error-msg">{deleteError}</p>}

          {loading ? (
            <p className="muted">Cargando...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : users.length === 0 ? (
            <p className="muted">No se encontraron usuarios.</p>
          ) : (
            <ul className="user-list">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={selectedId === user.id ? "user-item active" : "user-item"}
                >
                  <button
                    type="button"
                    className="user-name-btn"
                    onClick={() => setSelectedId(user.id)}
                  >
                    {user.name}
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Detalle del usuario</h2>
          {detailLoading ? (
            <p className="muted">Cargando...</p>
          ) : detailError ? (
            <p className="error-msg">{detailError}</p>
          ) : selectedUser ? (
            <dl className="detail-list">
              <div>
                <dt>Nombre</dt>
                <dd>{selectedUser.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selectedUser.email ?? "—"}</dd>
              </div>
              <div>
                <dt>Edad</dt>
                <dd>{selectedUser.age !== undefined ? `${selectedUser.age} años` : "—"}</dd>
              </div>
              <div>
                <dt>País</dt>
                <dd>{formatCountry(selectedUser.country)}</dd>
              </div>
              <div>
                <dt>Roles</dt>
                <dd>{formatRoles(selectedUser.roles)}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">Hacé clic en un usuario de la lista para ver sus datos.</p>
          )}
        </section>
      </div>

      <section className="card">
        <h2>Alta de usuario</h2>
        <form
          onSubmit={handleCreateUser}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}
        >
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Edad
            <input
              type="number"
              min={1}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            País
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
            >
              <option value="1">Argentina</option>
              <option value="2">Brasil</option>
            </select>
          </label>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button type="submit" disabled={creating} style={{ width: "100%" }}>
              {creating ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>

        {createError && <p className="error-msg" style={{ marginTop: "14px" }}>{createError}</p>}
        {createSuccess && <p className="success-msg" style={{ marginTop: "14px" }}>{createSuccess}</p>}
      </section>
    </div>
  );
}