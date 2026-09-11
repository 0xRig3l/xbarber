import type { Appointment } from "../types/appointment";

type AppointmentListProps = {
  appointments: Appointment[];
  isLoading: boolean;
  isAdmin: boolean;
  onCancel: (id: number) => void;
};

export function AppointmentList({
  appointments,
  isLoading,
  isAdmin,
  onCancel,
}: AppointmentListProps) {
  if (isLoading) {
    return <p role="status">Carregando agendamentos...</p>;
  }

  const visibleAppointments = isAdmin
    ? appointments
    : appointments.filter((a) => a.isOwner);

  if (visibleAppointments.length === 0) {
    return (
      <p>
        {isAdmin
          ? "Nenhum agendamento para hoje."
          : "Você não possui agendamentos nesta data."}
      </p>
    );
  }

  return (
    <ul className="appointment-list">
      {visibleAppointments.map((appointment) => (
        <li className="appointment-list__item" key={appointment.id}>
          <strong>{appointment.hora}:00</strong>
          <span>
            {appointment.isBlocked
              ? "Horário Bloqueado"
              : isAdmin
                ? appointment.clientName
                : "Seu agendamento"}
          </span>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => onCancel(appointment.id)}
          >
            {appointment.isBlocked ? "Desbloquear" : "Cancelar"}
          </button>
        </li>
      ))}
    </ul>
  );
}
