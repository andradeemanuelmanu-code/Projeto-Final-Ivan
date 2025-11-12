import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarRange, Calendar as CalendarIcon } from "lucide-react";

type ViewMode = "month" | "week" | "day";

const Agenda = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with View Mode Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-2xl text-foreground">
              Agenda de Eventos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize e gerencie todos os eventos cadastrados
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="gap-2"
            >
              <CalendarIcon size={16} />
              <span className="hidden sm:inline">Mês</span>
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="gap-2"
            >
              <CalendarRange size={16} />
              <span className="hidden sm:inline">Semana</span>
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className="gap-2"
            >
              <CalendarDays size={16} />
              <span className="hidden sm:inline">Dia</span>
            </Button>
          </div>
        </div>

        {/* Calendar Component */}
        <AgendaCalendar viewMode={viewMode} />
      </div>
    </DashboardLayout>
  );
};

export default Agenda;
