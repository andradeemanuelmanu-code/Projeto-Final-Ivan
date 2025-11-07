import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventoModal } from "@/components/eventos/EventoModal";
import { Evento, EventoFormData } from "@/types/evento";
import { eventosStorage } from "@/lib/eventosStorage";
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, Users, DollarSign, Clock, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "month" | "week" | "day";

const statusConfig = {
  pending: {
    label: "Pendente",
    className: "bg-[hsl(var(--status-pending))]",
    textColor: "text-white",
  },
  paid: {
    label: "Pago",
    className: "bg-[hsl(var(--status-paid))]",
    textColor: "text-white",
  },
  quote: {
    label: "Orçamento",
    className: "bg-[hsl(var(--status-quote))]",
    textColor: "text-white",
  },
};

export const AgendaCalendar = () => {
  const [eventos, setEventos] = useState<Evento[]>(eventosStorage.getAllSorted());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const { toast } = useToast();

  const reloadEventos = () => {
    setEventos(eventosStorage.getAllSorted());
  };

  const handleEventoClick = (evento: Evento) => {
    setSelectedEvento(evento);
    setActionModalOpen(true);
  };

  const handleEdit = () => {
    setActionModalOpen(false);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setActionModalOpen(false);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedEvento) {
      eventosStorage.delete(selectedEvento.id);
      reloadEventos();
      setDeleteDialogOpen(false);
      setSelectedEvento(null);
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso.",
      });
    }
  };

  const handleSave = (data: EventoFormData) => {
    if (selectedEvento) {
      eventosStorage.update(selectedEvento.id, data);
      toast({
        title: "Evento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      eventosStorage.create(data);
      toast({
        title: "Evento criado",
        description: "O evento foi adicionado à agenda.",
      });
    }
    reloadEventos();
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvento(null);
  };

  const eventosNoIntervalo = useMemo(() => {
    let start: Date, end: Date;

    if (viewMode === "month") {
      start = startOfMonth(selectedDate);
      end = endOfMonth(selectedDate);
    } else if (viewMode === "week") {
      start = startOfWeek(selectedDate, { locale: ptBR });
      end = endOfWeek(selectedDate, { locale: ptBR });
    } else {
      start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
    }

    return eventos.filter((evento) => {
      const eventoDate = new Date(evento.data);
      return isWithinInterval(eventoDate, { start, end });
    });
  }, [eventos, selectedDate, viewMode]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Evento[]>();
    eventosNoIntervalo.forEach((evento) => {
      const dateKey = format(new Date(evento.data), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(evento);
    });
    return map;
  }, [eventosNoIntervalo]);

  const eventDates = useMemo(() => {
    return Array.from(eventsByDate.keys()).map((dateStr) => new Date(dateStr));
  }, [eventsByDate]);

  const renderEventoTooltip = (evento: Evento) => (
    <div className="space-y-2 text-xs">
      <div>
        <p className="font-semibold text-sm">{evento.motivo}</p>
        <p className="text-muted-foreground">{evento.cliente.nome}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarIcon size={12} />
          <span>{format(new Date(evento.data), "dd/MM/yyyy", { locale: ptBR })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>{evento.horario.inicio} - {evento.horario.termino}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} />
          <span>{evento.convidados} convidados</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={12} />
          <span>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(evento.valor)}
          </span>
        </div>
      </div>
      <Badge className={cn(statusConfig[evento.statusPagamento].className, statusConfig[evento.statusPagamento].textColor, "text-xs")}>
        {statusConfig[evento.statusPagamento].label}
      </Badge>
    </div>
  );

  const renderDayContent = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const eventosNoDia = eventsByDate.get(dateKey) || [];

    if (eventosNoDia.length === 0) return null;

    return (
      <TooltipProvider>
        <div className="mt-1 space-y-0.5">
          {eventosNoDia.slice(0, 3).map((evento) => (
            <Tooltip key={evento.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventoClick(evento);
                  }}
                  className={cn(
                    "w-full h-1.5 rounded-sm transition-all hover:scale-105",
                    statusConfig[evento.statusPagamento].className
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                {renderEventoTooltip(evento)}
              </TooltipContent>
            </Tooltip>
          ))}
          {eventosNoDia.length > 3 && (
            <p className="text-[10px] text-muted-foreground text-center">
              +{eventosNoDia.length - 3}
            </p>
          )}
        </div>
      </TooltipProvider>
    );
  };

  const renderMobileList = () => (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg mb-4">Próximos Eventos</h3>
      {eventosNoIntervalo.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhum evento encontrado para este período.
        </p>
      ) : (
        eventosNoIntervalo.map((evento) => {
          const config = statusConfig[evento.statusPagamento];
          return (
            <Card
              key={evento.id}
              className={cn(
                "p-4 border-l-4 cursor-pointer transition-all hover:shadow-md",
                config.className.replace("bg-", "border-l-")
              )}
              onClick={() => handleEventoClick(evento)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base truncate">{evento.motivo}</h4>
                  <p className="text-sm text-muted-foreground truncate">{evento.cliente.nome}</p>
                </div>
                <Badge className={cn(config.className, config.textColor, "text-xs ml-2")}>
                  {config.label}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={12} />
                  <span>{format(new Date(evento.data), "dd/MM/yyyy", { locale: ptBR })} • {evento.horario.inicio}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} />
                  <span className="truncate">{evento.endereco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={12} />
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(evento.valor)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-display font-semibold text-xl">Agenda de Eventos</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Mês
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Dia
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            className="rounded-lg w-full pointer-events-auto"
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: "bold",
              },
            }}
            components={{
              Day: ({ date, ...props }) => (
                <div className="relative">
                  <button {...props} className="relative w-full">
                    {format(date, "d")}
                  </button>
                  {renderDayContent(date)}
                </div>
              ),
            }}
          />
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {eventosNoIntervalo.length} evento(s) neste período
            </p>
          </div>
        </div>

        <div className="md:hidden">{renderMobileList()}</div>
      </Card>

      <EventoModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        evento={selectedEvento || undefined}
      />

      <AlertDialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ações do Evento</AlertDialogTitle>
            <AlertDialogDescription>
              O que você deseja fazer com este evento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            <Button onClick={handleEdit} className="w-full justify-start" variant="outline">
              <Edit size={16} className="mr-2" />
              Editar Evento
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="w-full justify-start"
              variant="outline"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir Evento
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento "{selectedEvento?.motivo}"? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
