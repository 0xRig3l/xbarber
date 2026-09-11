const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3334";

type ApiErrorBody = {
  message?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type AuthResponse = {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
  };
};

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("xbarber:token");

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      body?.message ?? "Não foi possível concluir a operação.",
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
