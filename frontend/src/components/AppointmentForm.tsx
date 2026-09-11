import type { FormEvent } from "react";

import type { Appointment } from "../types/appointment";
import { getTodayIsoDate } from "../utils/date";
import { TimeSlotPicker } from "./TimeSlotPicker";

type AppointmentFormProps = {
  appointments: Appointment[];
  isSubmitting: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  selectedDate: string;
  selectedHour?: number;
  onDateChange: (date: string) => void;
  onHourChange: (hour: number) => void;
  onBlockedChange: (blocked: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AppointmentForm({
  appointments,
  isSubmitting,
  isAdmin,
  isBlocked,
  selectedDate,
  selectedHour,
  onDateChange,
  onHourChange,
  onBlockedChange,
  onSubmit,
}: AppointmentFormProps) {
  return (
    <form className="appointment-form" onSubmit={onSubmit}>
      <label>
        Data
        <input
          min={getTodayIsoDate()}
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </label>

      <fieldset>
        <legend>Horários</legend>
        <TimeSlotPicker
          appointments={appointments}
          selectedHour={selectedHour}
          onSelect={onHourChange}
        />
      </fieldset>

      {isAdmin && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isBlocked}
            onChange={(e) => onBlockedChange(e.target.checked)}
          />
          Bloquear este horário
        </label>
      )}

      <button
        className="button button--primary"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? "Aguarde..."
          : isBlocked
            ? "Bloquear Horário"
            : "Agendar"}
      </button>
    </form>
  );
}
