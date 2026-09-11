import { useState, type FormEvent } from "react";

import { useAuth } from "../contexts/AuthContext";

type AuthMode = "login" | "register";

export function LoginForm() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsSubmitting(true);
    setEmail("");
    setNome("");
    setSenha("");

    let errorMessage: string | undefined;

    if (mode === "login") {
      errorMessage = await login(email, senha);
    } else {
      if (!nome.trim()) {
        setError("Informe seu nome.");
        setIsSubmitting(false);
        return;
      }
      errorMessage = await register(nome.trim(), email, senha);
    }

    if (errorMessage) {
      setError(errorMessage);
    }

    setIsSubmitting(false);
  }

  function toggleMode() {
    setMode(mode === "login" ? "register" : "login");
    setError(undefined);
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">X Barber</h1>
          <p className="auth-subtitle">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="auth-label">
              Nome
              <input
                className="auth-input"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
          )}

          <label className="auth-label">
            E-mail
            <input
              className="auth-input"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Senha
            <input
              className="auth-input"
              placeholder="Sua senha"
              type="password"
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            className="auth-toggle-button"
            type="button"
            onClick={toggleMode}
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </p>
      </div>
    </div>
  );
}
