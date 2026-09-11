import { Prisma } from "../generated/prisma/client.js";
import type { ErrorRequestHandler } from "express";
import { z } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof z.ZodError) {
    response.status(400).json({ message: "Dados inválidos." });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(409).json({ message: "Este registro já existe." });
      return;
    }

    if (error.code === "P2025") {
      response.status(404).json({ message: "Registro não encontrado." });
      return;
    }
  }

  console.error(error);
  response.status(500).json({ message: "Erro interno do servidor." });
};
