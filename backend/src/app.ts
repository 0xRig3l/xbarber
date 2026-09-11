import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error-handler.js";
import { authGuard } from "./middlewares/auth-guard.js";
import { authRouter } from "./routes/auth-routes.js";
import { appointmentsRouter } from "./routes/appointments-routes.js";
import { usersRouter } from "./routes/users-routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/agendamentos", authGuard, appointmentsRouter);
app.use("/usuarios", authGuard, usersRouter);
app.use(errorHandler);
