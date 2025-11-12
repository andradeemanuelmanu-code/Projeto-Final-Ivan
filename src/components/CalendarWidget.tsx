import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Evento } from "@/types/evento";
import { parseLocalDate } from "@/lib/utils";

interface CalendarWidgetProps {
  eventos: Evento[];
}

const CalendarWidget = ({ eventos }: CalendarWidgetProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventDates = useMemo(() => {
    return eventos.map(evento => parseLocalDate(evento.data));
  }, [eventos]);

  const eventosEsteMes = useMemo(() => {
    const mesAtual = date?.getMonth();
    const anoAtual = date?.getFullYear();
    return eventos.filter(evento => {
      const dataEvento = parseLocalDate(evento.data);
      return dataEvento.getMonth() === mesAtual && dataEvento.getFullYear() === anoAtual;
    }).length;
  }, [eventos, date]);

  return (
    <Card className="p-6">
      <h3 className="font-display font-semibold text-lg mb-4">Calendário de Eventos</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg"
        modifiers={{
          hasEvent: eventDates
        }}
        modifiersStyles={{
          hasEvent: {
            fontWeight: "bold",
            color: "hsl(var(--accent))"
          }
        }}
      />
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {eventosEsteMes} {eventosEsteMes === 1 ? 'evento agendado' : 'eventos agendados'} este mês
        </p>
      </div>
    </Card>
  );
};

export default CalendarWidget;