import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EventStatus = "pending" | "paid" | "quote";

interface EventCardProps {
  title: string;
  client: string;
  date: string;
  location: string;
  guests: number;
  value: number;
  status: EventStatus;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    className: "bg-[hsl(var(--status-pending))] text-white",
    cardClass: "event-card-pending"
  },
  paid: {
    label: "Pago",
    className: "bg-[hsl(var(--status-paid))] text-white",
    cardClass: "event-card-paid"
  },
  quote: {
    label: "Orçamento",
    className: "bg-[hsl(var(--status-quote))] text-white",
    cardClass: "event-card-quote"
  }
};

const EventCard = ({ title, client, date, location, guests, value, status }: EventCardProps) => {
  const config = statusConfig[status];

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <div className={cn("event-card", config.cardClass)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{client}</p>
        </div>
        <Badge className={config.className}>
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} />
            <span>{guests} convidados</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <DollarSign size={16} />
            <span>{formattedValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;