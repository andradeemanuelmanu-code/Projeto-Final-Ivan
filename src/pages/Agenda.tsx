import DashboardLayout from "@/components/DashboardLayout";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";

const Agenda = () => {
  return (
    <DashboardLayout
      title="Agenda de Eventos"
      description="Visualize e gerencie todos os eventos cadastrados"
    >
      <div className="space-y-6">
        {/* Calendar Component */}
        <AgendaCalendar />
      </div>
    </DashboardLayout>
  );
};

export default Agenda;