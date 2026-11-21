import { useEffect, useState } from "react";
import { formatCountry, formatRoles, type User } from "./types";

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
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

    loadUsers();
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

  return (
    <div className="content-grid">
      <section className="card">
        <h2>Usuarios</h2>
        {loading ? (
          <p className="muted">Cargando...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
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
  );
}