import { z } from "zod";

export const registerSchema = z.object({
  nome: z
    .string({ error: "Nome inválido" })
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  email: z.email({ error: "Email inválido" }).trim(),
  senha: z
    .string({ error: "Senha inválida" })
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .max(32, "A senha deve ter no máximo 32 caracteres."),
});

export const loginSchema = z.object({
  email: z.email({ error: "Email inválido" }).trim(),
  senha: z
    .string({ error: "Senha inválida" })
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .max(32, "A senha deve ter no máximo 32 caracteres."),
});
