import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

type JwtPayload = {
  userId: number;
  isAdmin: boolean;
};

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      isAdmin?: boolean;
    }
  }
}

export function authGuard(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    response
      .status(401)
      .json({ message: "Token de autenticação não fornecido." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    request.userId = decoded.userId;
    request.isAdmin = decoded.isAdmin;
    next();
  } catch {
    response.status(401).json({ message: "Token inválido ou expirado." });
  }
}
