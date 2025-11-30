import { Calendar, MapPin, Users, DollarSign, Edit, Trash2, UtensilsCrossed, GlassWater, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Evento } from "@/types/evento";
import { cn, parseLocalDate } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventoCardProps {
  evento: Evento;
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
  onManagePayment: (evento: Evento) => void;
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

export const EventoCard = ({ evento, onEdit, onDelete, onManagePayment }: EventoCardProps) => {
  const config = statusConfig[evento.statusPagamento];
  
  const dataFormatada = format(parseLocalDate(evento.data), "dd/MM/yyyy", { locale: ptBR });
  
  const cardapioFormatado = evento.cardapio.map(c => cardapioLabels[c] || c).join(", ");
  const bebidasFormatadas = evento.bebidas.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(", ");

  const renderValor = () => {
    if (evento.statusPagamento === 'pending') {
      const valorPago = evento.valorEntrada || 0;
      const valorPendente = evento.valor - valorPago;

      return (
        <div className="flex flex-col items-start text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <span className="font-medium">Pago:</span>
            <span className="font-semibold">
              {valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <span className="font-medium">Pendente:</span>
            <span className="font-semibold">
              {valorPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 font-semibold text-foreground text-base sm:text-lg min-w-0">
        <DollarSign size={16} className="flex-shrink-0" />
        <span className="truncate">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(evento.valor)}
        </span>
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-card rounded-lg shadow-sm border-l-4 p-4 sm:p-5 transition-all duration-200",
      "hover:shadow-md hover:-translate-y-1",
      config.borderColor
    )}>
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-1 truncate">
            {evento.motivo}
          </h3>
          <p className="text-muted-foreground text-sm truncate">{evento.cliente.nome}</p>
        </div>
        <Badge className={cn(config.className, "flex-shrink-0 text-xs")}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={14} className="flex-shrink-0" />
          <span className="truncate">{dataFormatada} • {evento.horario.inicio} - {evento.horario.termino}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="line-clamp-1">{evento.endereco}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={14} className="flex-shrink-0" />
          <span>{evento.convidados} convidados</span>
        </div>
        {cardapioFormatado && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <UtensilsCrossed size={14} className="flex-shrink-0" />
            <span className="line-clamp-1">{cardapioFormatado}</span>
          </div>
        )}
        {bebidasFormatadas && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <GlassWater size={14} className="flex-shrink-0" />
            <span className="line-clamp-1">{bebidasFormatadas}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        {renderValor()}
        
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePayment(evento)}
            className="hover:bg-primary hover:text-primary-foreground h-8 w-8 p-0"
            aria-label="Gerenciar pagamento"
          >
            <CreditCard size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(evento)}
            className="hover:bg-primary hover:text-primary-foreground h-8 w-8 p-0"
            aria-label="Editar evento"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(evento.id)}
            className="hover:bg-destructive hover:text-destructive-foreground h-8 w-8 p-0"
            aria-label="Excluir evento"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};