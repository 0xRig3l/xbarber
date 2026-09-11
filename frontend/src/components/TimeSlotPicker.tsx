import type { Appointment } from "../types/appointment";

const OPENING_HOURS = Array.from({ length: 13 }, (_, index) => index + 9);

type TimeSlotPickerProps = {
  appointments: Appointment[];
  selectedHour?: number;
  onSelect: (hour: number) => void;
};

export function TimeSlotPicker({
  appointments,
  selectedHour,
  onSelect,
}: TimeSlotPickerProps) {
  const bookedMap = new Map(
    appointments.map((appointment) => [
      appointment.hora,
      appointment.isBlocked,
    ]),
  );

  return (
    <div className="time-slots">
      {OPENING_HOURS.map((hour) => {
        const isBooked = bookedMap.has(hour);
        const isBlocked = isBooked && bookedMap.get(hour);
        const isSelected = selectedHour === hour;

        let className = "time-slots__button";
        if (isSelected) className += " time-slots__button--selected";
        if (isBlocked) className += " time-slots__button--blocked";

        return (
          <button
            aria-pressed={isSelected}
            className={className}
            disabled={isBooked}
            key={hour}
            type="button"
            onClick={() => onSelect(hour)}
          >
            {hour}:00
          </button>
        );
      })}
    </div>
  );
}
