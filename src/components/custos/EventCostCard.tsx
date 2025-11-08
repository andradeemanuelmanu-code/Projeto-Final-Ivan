import { Evento } from "@/types/evento";
import { CalendarDays, User, UtensilsCrossed } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventCostCardProps {
  evento: Evento;
  hasCosts: boolean;
  onClick: () => void;
}

const cardapioLabels: Record<string, string> = {
  "churrasco-tradicional": "Churrasco Tradicional",
  "churrasco-prime": "Churrasco Prime",
  "churrasco-vip": "Churrasco VIP",
  "massas": "Massas",
  "roda-boteco": "Roda de Boteco",
  "coffee-break": "Coffee Break",
  "evento-kids": "Evento Kids",
  "jantar": "Jantar",
};

export function EventCostCard({ evento, hasCosts, onClick }: EventCostCardProps) {
  const statusBadgeClass = hasCosts
    ? "bg-[hsl(var(--status-paid))] text-white"
    : "bg-[hsl(var(--status-pending))] text-white";
  
  const statusText = hasCosts ? "Gastos Adicionados" : "Adicionar Gasto";

  return (
    <div className="event-card group cursor-pointer" onClick={onClick}>
      <div
        className={`${statusBadgeClass} -mx-5 -mt-5 mb-4 rounded-t-xl px-4 py-2 text-center text-sm font-semibold font-display transition-all duration-200 hover:brightness-110`}
      >
        {statusText}
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {evento.motivo}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{evento.cliente.nome}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              {format(new Date(evento.data), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {evento.cardapio.map((c) => cardapioLabels[c] || c).join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
