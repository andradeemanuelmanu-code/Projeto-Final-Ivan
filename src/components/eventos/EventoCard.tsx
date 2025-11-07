import { Calendar, MapPin, Users, DollarSign, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Evento } from "@/types/evento";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventoCardProps {
  evento: Evento;
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    className: "bg-[hsl(var(--status-pending))] text-white",
    borderColor: "border-l-[hsl(var(--status-pending))]"
  },
  paid: {
    label: "Pago",
    className: "bg-[hsl(var(--status-paid))] text-white",
    borderColor: "border-l-[hsl(var(--status-paid))]"
  },
  quote: {
    label: "Orçamento",
    className: "bg-[hsl(var(--status-quote))] text-white",
    borderColor: "border-l-[hsl(var(--status-quote))]"
  }
};

const cardapioLabels: Record<string, string> = {
  "churrasco-tradicional": "Churrasco Tradicional",
  "churrasco-prime": "Churrasco Prime",
  "churrasco-vip": "Churrasco VIP",
  "massas": "Massas",
  "roda-boteco": "Roda de Boteco",
  "coffee-break": "Coffee Break",
  "evento-kids": "Evento Kids",
  "jantar": "Jantar"
};

export const EventoCard = ({ evento, onEdit, onDelete }: EventoCardProps) => {
  const config = statusConfig[evento.statusPagamento];
  
  const dataFormatada = format(new Date(evento.data), "dd/MM/yyyy", { locale: ptBR });
  
  return (
    <div className={cn(
      "bg-card rounded-lg shadow-sm border-l-4 p-5 transition-all duration-200",
      "hover:shadow-md hover:-translate-y-1",
      config.borderColor
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
            {evento.motivo}
          </h3>
          <p className="text-muted-foreground text-sm">{evento.cliente.nome}</p>
        </div>
        <Badge className={config.className}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span>{dataFormatada} • {evento.horario.inicio} - {evento.horario.termino}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} />
          <span className="line-clamp-1">{evento.endereco}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span>{evento.convidados} convidados</span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1 font-semibold text-foreground text-lg">
          <DollarSign size={18} />
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(evento.valor)}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(evento)}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(evento.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
