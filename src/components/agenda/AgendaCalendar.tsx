import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, MapPin, CreditCard, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { eventosStorage } from "@/lib/eventosStorage";
import { escalasStorage, membrosStorage } from "@/lib/equipeStorage";
import { Evento } from "@/types/evento";
import { useToast } from "@/hooks/use-toast";
import { cn, parseLocalDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventoModal } from "@/components/eventos/EventoModal";

interface AgendaCalendarProps {
  viewMode: "month" | "week" | "day";
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50" },
  paid: { label: "Pago", color: "bg-green-500", textColor: "text-green-700", bgLight: "bg-green-50" },
  quote: { label: "Orçamento", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-50" },
};

const FUNCAO_LABELS: Record<string, string> = {
  cozinheira: "Cozinheira",
  "ajudante-cozinheira": "Ajudante de Cozinheira",
  churrasqueiro: "Churrasqueiro",
  "ajudante-churrasqueiro": "Ajudante de Churrasqueiro",
  garcom: "Garçom",
  barman: "Barman",
  maitre: "Maître",
};

const AgendaCalendar = ({ viewMode }: AgendaCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = () => {
    const loadedEventos = eventosStorage.getAllSorted();
    setEventos(loadedEventos);
  };

  const getEquipeInfo = (eventoId: string): string[] => {
    const escala = escalasStorage.getByEventoId(eventoId);
    if (!escala || escala.membros.length === 0) {
      return [];
    }
    return escala.membros
      .map(membroEscalado => {
        const membro = membrosStorage.getById(membroEscalado.membroId);
        if (membro) {
          const funcaoLabel = FUNCAO_LABELS[membroEscalado.funcao] || membroEscalado.funcao;
          return `${membro.nome} - ${funcaoLabel}`;
        }
        return null;
      })
      .filter((info): info is string => !!info);
  };

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRange = useMemo(() => {
    if (viewMode === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startWithWeek = startOfWeek(start, { weekStartsOn: 0 });
      const endWithWeek = endOfWeek(end, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: startWithWeek, end: endWithWeek });
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      return [currentDate];
    }
  }, [currentDate, viewMode]);

  const getEventosForDate = (date: Date) => {
    return eventos.filter(evento => isSameDay(parseLocalDate(evento.data), date));
  };

  const handleEventClick = (evento: Evento) => {
    setSelectedEvento(evento);
    setIsActionDialogOpen(true);
  };

  const handleEdit = () => {
    setIsActionDialogOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsActionDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedEvento) {
      const success = eventosStorage.delete(selectedEvento.id);
      if (success) {
        toast({
          title: "Evento excluído",
          description: "O evento foi removido com sucesso.",
        });
        loadEventos();
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedEvento(null);
  };

  const handleSaveEdit = (data: any) => {
    if (selectedEvento) {
      eventosStorage.update(selectedEvento.id, data);
      toast({
        title: "Evento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      loadEventos();
      setIsEditModalOpen(false);
      setSelectedEvento(null);
    }
  };

  const getHeaderText = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(start, "d MMM", { locale: ptBR })} - ${format(end, "d MMM yyyy", { locale: ptBR })}`;
    } else {
      return format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  const renderActionDialogContent = () => {
    if (!selectedEvento) return null;
    const equipeInfo = getEquipeInfo(selectedEvento.id);

    return (
      <>
        <DialogHeader>
          <DialogTitle>{selectedEvento.motivo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <span>{selectedEvento.cliente.nome}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span>
                {format(parseLocalDate(selectedEvento.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                {" • "}
                {selectedEvento.horario.inicio} - {selectedEvento.horario.termino}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-xs">{selectedEvento.endereco}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-muted-foreground" />
              <Badge variant="secondary" className={cn(statusConfig[selectedEvento.statusPagamento].textColor, statusConfig[selectedEvento.statusPagamento].bgLight)}>
                {statusConfig[selectedEvento.statusPagamento].label}
              </Badge>
            </div>
            <div className="flex items-start gap-2 pt-2 mt-2 border-t">
              <Users size={16} className="text-muted-foreground mt-0.5" />
              <div className="flex flex-col text-sm">
                <span className="font-medium mb-1">Equipe Escalada</span>
                {equipeInfo.length > 0 ? (
                  <div className="text-muted-foreground flex flex-col">
                    {equipeInfo.map((info, index) => (
                      <span key={index}>{info}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Nenhuma equipe escalada</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Mobile: Lista cronológica
  if (isMobile) {
    const upcomingEventos = eventos
      .filter(evento => parseLocalDate(evento.data) >= new Date())
      .slice(0, 20);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Próximos Eventos</h3>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoje
          </Button>
        </div>

        <div className="space-y-3">
          {upcomingEventos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum evento próximo</p>
            </Card>
          ) : (
            upcomingEventos.map(evento => {
              const status = statusConfig[evento.statusPagamento];
              return (
                <Card
                  key={evento.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4"
                  style={{ borderLeftColor: status.color.replace("bg-", "").replace("500", "") }}
                  onClick={() => handleEventClick(evento)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{evento.motivo}</h4>
                        <Badge variant="secondary" className={cn("text-xs", status.textColor, status.bgLight)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{evento.cliente.nome}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{format(parseLocalDate(evento.data), "d 'de' MMM", { locale: ptBR })} • {evento.horario.inicio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Action Dialog */}
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            {renderActionDialogContent()}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={handleEdit} className="w-full sm:w-auto gap-2">
                <Edit size={16} />
                Editar
              </Button>
              <Button onClick={handleDeleteClick} variant="destructive" className="w-full sm:w-auto gap-2">
                <Trash2 size={16} />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <EventoModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvento(null);
          }}
          onSave={handleSaveEdit}
          evento={selectedEvento || undefined}
        />

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o evento "{selectedEvento?.motivo}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Desktop: Calendário
  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight size={20} />
            </Button>
            <h3 className="font-semibold text-lg ml-2 capitalize">{getHeaderText()}</h3>
          </div>
          <Button variant="outline" onClick={handleToday}>
            Hoje
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="p-4">
          {viewMode === "month" && (
            <div className="space-y-2">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDateRange.map((date, index) => {
                  const dayEventos = getEventosForDate(date);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-24 p-2 rounded-lg border transition-colors",
                        isCurrentMonth ? "bg-card" : "bg-muted/30",
                        isTodayDate && "ring-2 ring-primary"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                        isTodayDate && "text-primary font-bold"
                      )}>
                        {format(date, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEventos.slice(0, 3).map(evento => {
                          const status = statusConfig[evento.statusPagamento];
                          const equipeInfo = getEquipeInfo(evento.id);
                          return (
                            <Tooltip key={evento.id}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "text-xs px-2 py-1 rounded cursor-pointer truncate border-l-2 transition-all hover:shadow-md",
                                    status.bgLight
                                  )}
                                  style={{ borderLeftColor: status.color.replace("bg-", "").replace("500", "") }}
                                  onClick={() => handleEventClick(evento)}
                                >
                                  <div className="font-medium truncate">{evento.motivo}</div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-2">
                                  <div>
                                    <p className="font-semibold">{evento.motivo}</p>
                                    <Badge variant="secondary" className={cn("text-xs mt-1", status.textColor, status.bgLight)}>
                                      {status.label}
                                    </Badge>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1">
                                      <User size={12} />
                                      <span>{evento.cliente.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>{evento.horario.inicio} - {evento.horario.termino}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin size={12} />
                                      <span>{evento.endereco}</span>
                                    </div>
                                    {equipeInfo.length > 0 && (
                                      <div className="flex items-start gap-1 pt-1 mt-1 border-t">
                                        <Users size={12} className="mt-0.5" />
                                        <div className="flex flex-col">
                                          {equipeInfo.map((info, i) => <span key={i}>{info}</span>)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                        {dayEventos.length > 3 && (
                          <div className="text-xs text-muted-foreground px-2">
                            +{dayEventos.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "week" && (
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {getDateRange.map((date, index) => {
                  const dayEventos = getEventosForDate(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div key={index} className={cn("space-y-2", isTodayDate && "ring-2 ring-primary rounded-lg p-2")}>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {format(date, "EEE", { locale: ptBR })}
                        </div>
                        <div className={cn("text-lg font-semibold", isTodayDate && "text-primary")}>
                          {format(date, "d")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {dayEventos.map(evento => {
                          const status = statusConfig[evento.statusPagamento];
                          const equipeInfo = getEquipeInfo(evento.id);
                          return (
                            <Tooltip key={evento.id}>
                              <TooltipTrigger asChild>
                                <Card
                                  className={cn("p-2 cursor-pointer hover:shadow-md transition-shadow border-l-4", status.bgLight)}
                                  style={{ borderLeftColor: status.color.replace("bg-", "").replace("500", "") }}
                                  onClick={() => handleEventClick(evento)}
                                >
                                  <div className="text-xs font-medium truncate">{evento.motivo}</div>
                                  <div className="text-xs text-muted-foreground">{evento.horario.inicio}</div>
                                </Card>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-2">
                                  <div>
                                    <p className="font-semibold">{evento.motivo}</p>
                                    <Badge variant="secondary" className={cn("text-xs mt-1", status.textColor, status.bgLight)}>
                                      {status.label}
                                    </Badge>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div className="flex items-center gap-1">
                                      <User size={12} />
                                      <span>{evento.cliente.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>{evento.horario.inicio} - {evento.horario.termino}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin size={12} />
                                      <span>{evento.endereco}</span>
                                    </div>
                                    {equipeInfo.length > 0 && (
                                      <div className="flex items-start gap-1 pt-1 mt-1 border-t">
                                        <Users size={12} className="mt-0.5" />
                                        <div className="flex flex-col">
                                          {equipeInfo.map((info, i) => <span key={i}>{info}</span>)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "day" && (
            <div className="space-y-4">
              <div className="text-center py-4 border-b">
                <div className="text-sm text-muted-foreground">
                  {format(currentDate, "EEEE", { locale: ptBR })}
                </div>
                <div className="text-2xl font-bold">{format(currentDate, "d")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div className="space-y-3">
                {getEventosForDate(currentDate).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum evento neste dia
                  </div>
                ) : (
                  getEventosForDate(currentDate).map(evento => {
                    const status = statusConfig[evento.statusPagamento];
                    return (
                      <Card
                        key={evento.id}
                        className={cn("p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4", status.bgLight)}
                        style={{ borderLeftColor: status.color.replace("bg-", "").replace("500", "") }}
                        onClick={() => handleEventClick(evento)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{evento.motivo}</h4>
                              <Badge variant="secondary" className={cn("text-xs mt-1", status.textColor, status.bgLight)}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {evento.horario.inicio} - {evento.horario.termino}
                            </div>
                          </div>
                          <div className="text-sm space-y-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <span>{evento.cliente.nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{evento.endereco}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Action Dialog */}
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            {renderActionDialogContent()}
            <DialogFooter>
              <Button onClick={handleEdit} className="gap-2">
                <Edit size={16} />
                Editar
              </Button>
              <Button onClick={handleDeleteClick} variant="destructive" className="gap-2">
                <Trash2 size={16} />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <EventoModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvento(null);
          }}
          onSave={handleSaveEdit}
          evento={selectedEvento || undefined}
        />

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o evento "{selectedEvento?.motivo}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default AgendaCalendar;