import { Router } from "express";

import { usersController } from "../controllers/users-controller.js";

export const usersRouter = Router();

usersRouter.get("/", usersController.list);
usersRouter.patch("/:id/promote", usersController.promote);
