import { Evento } from "@/types/evento";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, UtensilsCrossed } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, parseLocalDate } from "@/lib/utils";

interface CardEventoEscalaProps {
  evento: Evento;
  hasEscala: boolean;
  onClick: () => void;
}

const CARDAPIO_LABELS: Record<string, string> = {
  "churrasco-tradicional": "Churrasco Tradicional",
  "churrasco-prime": "Churrasco Prime",
  "churrasco-vip": "Churrasco VIP",
  "massas": "Massas",
  "roda-boteco": "Roda de Boteco",
  "coffee-break": "Coffee Break",
  "evento-kids": "Evento Kids",
  "jantar": "Jantar",
};

export const CardEventoEscala = ({ evento, hasEscala, onClick }: CardEventoEscalaProps) => {
  const dataFormatada = format(parseLocalDate(evento.data), "dd/MM/yyyy", { locale: ptBR });
  const cardapioPrincipal = evento.cardapio[0] ? CARDAPIO_LABELS[evento.cardapio[0]] || evento.cardapio[0] : "Não definido";

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onClick={onClick}
    >
      {/* Tarja de Status */}
      <div 
        className={cn(
          "px-4 py-2 text-sm font-medium text-white text-center",
          hasEscala ? "bg-[#5CB85C]" : "bg-[#D9534F]"
        )}
      >
        {hasEscala ? "Escala Feita" : "Fazer Escala"}
      </div>

      <CardContent className="p-6 space-y-3">
        {/* Motivo do Evento */}
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {evento.motivo}
          </h3>
        </div>

        {/* Cliente */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <User size={16} />
          <span className="text-sm">{evento.cliente.nome}</span>
        </div>

        {/* Data */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span className="text-sm">{dataFormatada}</span>
        </div>

        {/* Cardápio */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <UtensilsCrossed size={16} />
          <span className="text-sm">{cardapioPrincipal}</span>
        </div>
      </CardContent>
    </Card>
  );
};
