import { Evento } from "@/types/evento";
import { custosStorage } from "@/lib/custosStorage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";

interface ExecutedEventsListProps {
  eventos: Evento[];
  onEventoClick: (eventoId: string) => void;
}

export function ExecutedEventsList({ eventos, onEventoClick }: ExecutedEventsListProps) {
  if (eventos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum evento executado encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 px-4 py-3 border-b font-display font-semibold bg-muted/50">
        <div>Motivo do Evento</div>
        <div>Cliente</div>
        <div>Data</div>
        <div className="text-right">Total de Gastos</div>
      </div>

      <div className="divide-y md:divide-y-0">
        {eventos.map((evento) => {
          const totalGastos = custosStorage.getTotalByEventoId(evento.id);
          return (
            <div
              key={evento.id}
              className="p-4 md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr] md:gap-4 md:items-center md:px-4 md:py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onEventoClick(evento.id)}
            >
              {/* Motivo e Total (Mobile) */}
              <div className="flex justify-between items-start md:block">
                <div className="font-medium pr-2">{evento.motivo}</div>
                <div className="md:hidden font-semibold text-lg shrink-0">
                  {totalGastos > 0 ? (
                    <span className="text-[hsl(var(--status-paid))]">
                      {totalGastos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              {/* Cliente */}
              <div className="flex justify-between items-center mt-2 md:mt-0">
                <span className="md:hidden text-sm text-muted-foreground">Cliente</span>
                <span className="text-sm text-right md:text-left">{evento.cliente.nome}</span>
              </div>

              {/* Data */}
              <div className="flex justify-between items-center mt-1 md:mt-0">
                <span className="md:hidden text-sm text-muted-foreground">Data</span>
                <span className="text-sm text-right md:text-left">
                  {format(parseLocalDate(evento.data), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>

              {/* Total (Desktop) */}
              <div className="hidden md:block text-right font-semibold">
                {totalGastos > 0 ? (
                  <span className="text-[hsl(var(--status-paid))]">
                    {totalGastos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}