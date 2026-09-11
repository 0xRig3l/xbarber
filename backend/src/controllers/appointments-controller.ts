import type { Request, Response } from "express";

import { prisma } from "../database/prisma.js";
import {
  appointmentIdSchema,
  appointmentQuerySchema,
  createAppointmentSchema,
} from "../schemas/appointment-schemas.js";

export const appointmentsController = {
  async list(request: Request, response: Response) {
    const { data } = appointmentQuerySchema.parse(request.query);
    const appointments = await prisma.agendamento.findMany({
      where: { data },
      include: { usuario: { select: { nome: true } } },
      orderBy: { hora: "asc" },
    });

    const mappedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      data: appointment.data,
      hora: appointment.hora,
      isBlocked: appointment.isBlocked,
      criadoEm: appointment.criadoEm,
      isOwner: appointment.usuarioId === request.userId,
      clientName: request.isAdmin ? appointment.usuario.nome : undefined,
    }));

    response.json(mappedAppointments);
  },

  async create(request: Request, response: Response) {
    const data = createAppointmentSchema.parse(request.body);

    const existingAppointment = await prisma.agendamento.findFirst({
      where: {
        usuarioId: request.userId,
        data: data.data,
      },
    });

    if (existingAppointment) {
      response.status(409).json({ message: "Você já possui um agendamento para este dia." });
      return;
    }

    if (data.isBlocked && !request.isAdmin) {
      response.status(403).json({ message: "Apenas administradores podem bloquear horários." });
      return;
    }

    const appointment = await prisma.agendamento.create({
      data: {
        data: data.data,
        hora: data.hora,
        usuarioId: request.userId!,
        isBlocked: data.isBlocked ?? false,
      },
    });

    response.status(201).json(appointment);
  },

  async remove(request: Request, response: Response) {
    const { id } = appointmentIdSchema.parse(request.params);

    const appointment = await prisma.agendamento.findUnique({
      where: { id },
    });

    if (!appointment || (appointment.usuarioId !== request.userId && !request.isAdmin)) {
      response.status(403).json({
        message: "Proibido: você não pode cancelar este agendamento.",
      });
      return;
    }

    await prisma.agendamento.delete({
      where: { id },
    });

    response.status(204).end();
  },
};
