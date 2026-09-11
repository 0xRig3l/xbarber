import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

type User = {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
};

export function AdminUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await apiRequest<User[]>("/usuarios");
      setUsers(data);
    } catch (err) {
      setError("Erro ao carregar usuários.");
    } finally {
      setIsLoading(false);
    }
  }

  async function promoteUser(id: number) {
    if (
      !window.confirm("Deseja realmente promover este usuário a administrador?")
    )
      return;

    try {
      await apiRequest(`/usuarios/${id}/promote`, { method: "PATCH" });
      await loadUsers();
    } catch (err) {
      alert("Erro ao promover usuário.");
    }
  }

  if (isLoading) return <p>Carregando usuários...</p>;
  if (error) return <p className="feedback feedback--error">{error}</p>;

  return (
    <div className="admin-users">
      <h3>Gerenciar Usuários</h3>
      <ul className="appointment-list">
        {users.map((user) => (
          <li
            key={user.id}
            className="appointment-list__item"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <strong>{user.nome}</strong>
              {user.isAdmin ? (
                <span style={{ color: "red", marginLeft: "0.5rem" }}>
                  Admin
                </span>
              ) : (
                <button
                  className="button button--secondary"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  onClick={() => promoteUser(user.id)}
                >
                  Tornar Admin
                </button>
              )}
            </div>
            <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>
              {user.email}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
