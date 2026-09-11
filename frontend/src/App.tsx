import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentList } from "./components/AppointmentList";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { LoginForm } from "./components/LoginForm";
import { AdminUsersList } from "./components/AdminUsersList";
import { useAuth } from "./contexts/AuthContext";
import { useAppointments } from "./hooks/useAppointments";

function Scheduler() {
  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const {
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
  } = useAppointments();

  return (
    <>
      <header className="topbar">
        <p className="topbar__greeting">
          Olá, <strong>{user?.nome}</strong>
        </p>
        <button className="topbar__logout" type="button" onClick={logout}>
          Sair
        </button>
      </header>

      <main className="scheduler">
        <section
          className="scheduler__panel"
          aria-labelledby="new-appointment-title"
        >
          <h1 id="new-appointment-title">Agende um atendimento</h1>
          <p>Escolha a data e o horário.</p>

          <AppointmentForm
            appointments={appointments}
            isSubmitting={isSubmitting}
            isAdmin={isAdmin}
            isBlocked={isBlocked}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            onDateChange={selectDate}
            onHourChange={selectHour}
            onBlockedChange={setIsBlocked}
            onSubmit={createAppointment}
          />

          <FeedbackMessage error={error} success={successMessage} />
        </section>

        <section
          className="scheduler__panel"
          aria-labelledby="appointments-title"
        >
          <h2 id="appointments-title">Agendamentos</h2>
          <AppointmentList
            appointments={appointments}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onCancel={cancelAppointment}
          />
        </section>

        {isAdmin && (
          <section className="scheduler__panel" aria-labelledby="admin-title">
            <h2 id="admin-title">Administração</h2>
            <AdminUsersList />
          </section>
        )}
      </main>
    </>
  );
}

export function App() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return user ? <Scheduler /> : <LoginForm />;
}
