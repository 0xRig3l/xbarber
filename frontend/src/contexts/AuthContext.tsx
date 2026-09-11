import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth";
import { ApiError } from "../services/api";

type User = {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextData = {
  user: User | null;
  isAuthLoading: boolean;
  login: (email: string, senha: string) => Promise<string | undefined>;
  register: (
    nome: string,
    email: string,
    senha: string,
  ) => Promise<string | undefined>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = "xbarber:token";
const USER_KEY = "xbarber:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsAuthLoading(false);
  }, []);

  function saveSession(token: string, usuario: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUser(usuario);
  }

  async function login(
    email: string,
    senha: string,
  ): Promise<string | undefined> {
    try {
      const { token, usuario } = await authService.login(email, senha);
      saveSession(token, usuario);
      return undefined;
    } catch (error) {
      return error instanceof ApiError
        ? error.message
        : "Não foi possível fazer login.";
    }
  }

  async function register(
    nome: string,
    email: string,
    senha: string,
  ): Promise<string | undefined> {
    try {
      const { token, usuario } = await authService.register(nome, email, senha);
      saveSession(token, usuario);
      return undefined;
    } catch (error) {
      return error instanceof ApiError
        ? error.message
        : "Não foi possível criar a conta.";
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
