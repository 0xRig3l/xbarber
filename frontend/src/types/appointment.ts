export type Appointment = {
  id: number;
  data: string;
  hora: number;
  criadoEm: string;
  isOwner?: boolean;
  isBlocked?: boolean;
  clientName?: string;
};

export type CreateAppointmentInput = Pick<
  Appointment,
  "data" | "hora" | "isBlocked"
>;
