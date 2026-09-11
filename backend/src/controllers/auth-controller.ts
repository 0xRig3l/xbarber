import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../database/prisma.js";
import { env } from "../config/env.js";
import { registerSchema, loginSchema } from "../schemas/auth-schemas.js";

function generateToken(userId: number, isAdmin: boolean) {
  return jwt.sign({ userId, isAdmin }, env.jwtSecret, { expiresIn: "1d" });
}

export const authController = {
  async register(request: Request, response: Response) {
    const { nome, email, senha } = registerSchema.parse(request.body);

    const existingUser = await prisma.usuario.findUnique({ where: { email } });

    if (existingUser) {
      response.status(409).json({ message: "Este e-mail já está cadastrado." });
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: { nome, email, senha: hashedPassword },
    });

    const token = generateToken(user.id, user.isAdmin);

    response.status(201).json({
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email, isAdmin: user.isAdmin },
    });
  },

  async login(request: Request, response: Response) {
    const { email, senha } = loginSchema.parse(request.body);

    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      response.status(401).json({ message: "E-mail ou senha incorretos." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      response.status(401).json({ message: "E-mail ou senha incorretos." });
      return;
    }

    const token = generateToken(user.id, user.isAdmin);

    response.json({
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email, isAdmin: user.isAdmin },
    });
  },
};
