import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const appointmentQuerySchema = z.object({
  data: dateSchema,
});

export const createAppointmentSchema = z.object({
  data: dateSchema,
  hora: z.number().int().min(9).max(21),
  isBlocked: z.boolean().optional(),
});

export const appointmentIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
