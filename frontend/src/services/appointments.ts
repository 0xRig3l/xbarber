import type { Appointment, CreateAppointmentInput } from "../types/appointment";
import { apiRequest } from "./api";

export const appointmentsService = {
  listByDate(date: string) {
    return apiRequest<Appointment[]>(
      `/agendamentos?data=${encodeURIComponent(date)}`,
    );
  },

  create(input: CreateAppointmentInput) {
    return apiRequest<Appointment>("/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  cancel(id: number) {
    return apiRequest<void>(`/agendamentos/${id}`, { method: "DELETE" });
  },
};

export { ApiError } from "./api";
