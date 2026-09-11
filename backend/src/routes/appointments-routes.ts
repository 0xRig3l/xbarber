import { Router } from "express";

import { appointmentsController } from "../controllers/appointments-controller.js";

export const appointmentsRouter = Router();

appointmentsRouter.get("/", appointmentsController.list);
appointmentsRouter.post("/", appointmentsController.create);
appointmentsRouter.delete("/:id", appointmentsController.remove);
