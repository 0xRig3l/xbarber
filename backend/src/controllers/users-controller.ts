import type { Request, Response } from "express";

import { prisma } from "../database/prisma.js";
import { z } from "zod";

const userIdSchema = z.object({
  id: z.coerce.number().positive(),
});

export const usersController = {
  async list(request: Request, response: Response) {
    if (!request.isAdmin) {
      response.status(403).json({ message: "Apenas administradores podem listar usuários." });
      return;
    }

    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        isAdmin: true,
        criadoEm: true,
      },
      orderBy: { nome: "asc" },
    });

    response.json(users);
  },

  async promote(request: Request, response: Response) {
    if (!request.isAdmin) {
      response.status(403).json({ message: "Apenas administradores podem promover usuários." });
      return;
    }

    const { id } = userIdSchema.parse(request.params);

    const user = await prisma.usuario.findUnique({ where: { id } });

    if (!user) {
      response.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    await prisma.usuario.update({
      where: { id },
      data: { isAdmin: true },
    });

    response.status(200).json({ message: "Usuário promovido a administrador." });
  },
};
