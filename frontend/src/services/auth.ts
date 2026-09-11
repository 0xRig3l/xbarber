import { apiRequest, type AuthResponse } from "./api";

export const authService = {
  login(email: string, senha: string) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
  },

  register(nome: string, email: string, senha: string) {
    return apiRequest<AuthResponse>("/auth/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
  },
};
