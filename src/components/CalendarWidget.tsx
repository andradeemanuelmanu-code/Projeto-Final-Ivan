import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Evento } from "@/types/evento";
import { parseLocalDate, cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User } from "lucide-react";

interface CalendarWidgetProps {
  eventos: Evento[];
}

const CalendarWidget = ({ eventos }: CalendarWidgetProps) => {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();

  const eventDates = useMemo(() => {
    return eventos.map(evento => parseLocalDate(evento.data));
  }, [eventos]);

  const eventosEsteMes = useMemo(() => {
    const mesAtual = month.getMonth();
    const anoAtual = month.getFullYear();
    return eventos.filter(evento => {
      const dataEvento = parseLocalDate(evento.data);
      return dataEvento.getMonth() === mesAtual && dataEvento.getFullYear() === anoAtual;
    }).length;
  }, [eventos, month]);

  const eventosDoDiaSelecionado = useMemo(() => {
    if (!selectedDay) return [];
    return eventos
      .filter(evento => isSameDay(parseLocalDate(evento.data), selectedDay))
      .sort((a, b) => a.horario.inicio.localeCompare(b.horario.inicio));
  }, [eventos, selectedDay]);

  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      // Desseleciona se clicar no mesmo dia
      if (selectedDay && isSameDay(day, selectedDay)) {
        setSelectedDay(undefined);
      } else {
        setSelectedDay(day);
      }
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="font-display font-semibold text-lg mb-4">Calendário de Eventos</h3>
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={handleDayClick}
        month={month}
        onMonthChange={setMonth}
        className="rounded-lg"
        modifiers={{
          hasEvent: eventDates
        }}
        modifiersClassNames={{
          hasEvent: "day-with-event"
        }}
      />
      <div className="mt-4 pt-4 border-t border-border min-h-[100px]">
        {selectedDay ? (
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">
              Eventos para {format(selectedDay, "dd 'de' MMMM'", { locale: ptBR })}
            </h4>
            {eventosDoDiaSelecionado.length > 0 ? (
              <div className="space-y-3">
                {eventosDoDiaSelecionado.map(evento => (
                  <div key={evento.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm text-primary truncate">{evento.motivo}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{evento.horario.inicio}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span className="truncate">{evento.cliente.nome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum evento para este dia.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold font-display text-primary">
              {eventosEsteMes}
            </p>
            <p className="text-sm text-muted-foreground">
              {eventosEsteMes === 1 ? 'evento agendado' : 'eventos agendados'} este mês
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CalendarWidget;