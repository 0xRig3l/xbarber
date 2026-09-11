import { useCallback, useEffect, useState, type FormEvent } from "react";

import { ApiError, appointmentsService } from "../services/appointments";
import type { Appointment } from "../types/appointment";
import { getTodayIsoDate } from "../utils/date";

const INITIAL_DATE = getTodayIsoDate();

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAppointments() {
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const [selectedHour, setSelectedHour] = useState<number>();
  const [isBlocked, setIsBlocked] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      setAppointments(await appointmentsService.listByDate(selectedDate));
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Falha ao carregar agendamentos."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  function selectDate(date: string) {
    setSelectedDate(date);
    setSelectedHour(undefined);
    setSuccessMessage(undefined);
  }

  function selectHour(hour: number) {
    setSelectedHour(hour);
    setSuccessMessage(undefined);
  }

  async function createAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSuccessMessage(undefined);

    if (selectedHour === undefined) {
      setError("Informe um horário.");
      return;
    }

    setIsSubmitting(true);

    try {
      await appointmentsService.create({
        data: selectedDate,
        hora: selectedHour,
        isBlocked,
      });
      setSelectedHour(undefined);
      setIsBlocked(false);
      setSuccessMessage("Agendamento criado com sucesso.");
      await loadAppointments();
    } catch (createError) {
      setError(
        getErrorMessage(createError, "Não foi possível criar o agendamento."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function cancelAppointment(id: number) {
    if (!window.confirm("Deseja cancelar/desbloquear este agendamento?")) {
      return;
    }

    setError(undefined);
    setSuccessMessage(undefined);

    try {
      await appointmentsService.cancel(id);
      setSuccessMessage("Agendamento cancelado com sucesso.");
      await loadAppointments();
    } catch (cancelError) {
      setError(
        getErrorMessage(
          cancelError,
          "Não foi possível cancelar o agendamento.",
        ),
      );
    }
  }

  return {
    appointments,
    error,
    isLoading,
    isSubmitting,
    isBlocked,
    selectedDate,
    selectedHour,
    successMessage,
    cancelAppointment,
    createAppointment,
    selectDate,
    selectHour,
    setIsBlocked,
  };
}
