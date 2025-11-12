import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { EventCostCard } from "@/components/custos/EventCostCard";
import { AddCostModal } from "@/components/custos/AddCostModal";
import { ExecutedEventsList } from "@/components/custos/ExecutedEventsList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { eventosStorage } from "@/lib/eventosStorage";
import { custosStorage } from "@/lib/custosStorage";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { parseLocalDate } from "@/lib/utils";

export default function CustosPorEvento() {
  const [eventos] = useState(() => eventosStorage.getAllSorted());
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [isLoading] = useState(false);

  const eventosFuturos = useMemo(
    () => eventos.filter((evento) => parseLocalDate(evento.data) >= new Date()),
    [eventos]
  );

  const eventosComCustos = useMemo(
    () =>
      eventosFuturos.map((evento) => ({
        evento,
        hasCosts: custosStorage.hasEventoCosts(evento.id),
      })),
    [eventosFuturos]
  );

  const eventosSorted = useMemo(
    () =>
      [...eventosComCustos].sort((a, b) => {
        if (a.hasCosts === b.hasCosts) return 0;
        return a.hasCosts ? 1 : -1;
      }),
    [eventosComCustos]
  );

  const firstEightEvents = eventosSorted.slice(0, 8);
  const remainingEvents = eventosSorted.slice(8);

  const handleOpenCostModal = (eventoId: string) => {
    setSelectedEventoId(eventoId);
  };

  const handleSaveCost = (custoData: any) => {
    if (!selectedEventoId) return;

    custosStorage.create({
      ...custoData,
      eventoId: selectedEventoId,
    });

    toast({
      title: "Gasto adicionado com sucesso!",
      description: "O custo foi registrado no evento.",
    });

    setSelectedEventoId(null);
    window.location.reload();
  };

  const selectedEvento = eventos.find((e) => e.id === selectedEventoId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/eventos">Eventos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/agenda">Agenda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Custos por Evento</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="font-display text-3xl font-bold text-foreground">
            Custos por Evento
          </h1>
          <p className="text-muted-foreground">
            Gerencie os gastos de cada evento e acompanhe os custos registrados.
          </p>
        </div>

        {/* Cards de Eventos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {firstEightEvents.map(({ evento, hasCosts }) => (
                <EventCostCard
                  key={evento.id}
                  evento={evento}
                  hasCosts={hasCosts}
                  onClick={() => handleOpenCostModal(evento.id)}
                />
              ))}
            </div>

            {remainingEvents.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllEventsModal(true)}
                  className="font-display"
                >
                  Ver mais eventos ({remainingEvents.length})
                </Button>
              </div>
            )}
          </>
        )}

        {/* Lista de Eventos Executados */}
        <div className="space-y-4 pt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Eventos Executados
          </h2>
          <ExecutedEventsList eventos={eventos} />
        </div>
      </div>

      {/* Modal: Ver Mais Eventos */}
      <Dialog open={showAllEventsModal} onOpenChange={setShowAllEventsModal}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Todos os Eventos ({remainingEvents.length})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {remainingEvents.map(({ evento, hasCosts }) => (
                <EventCostCard
                  key={evento.id}
                  evento={evento}
                  hasCosts={hasCosts}
                  onClick={() => {
                    setShowAllEventsModal(false);
                    handleOpenCostModal(evento.id);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal: Adicionar Custo */}
      {selectedEvento && (
        <AddCostModal
          open={!!selectedEventoId}
          onClose={() => setSelectedEventoId(null)}
          onSave={handleSaveCost}
          eventoMotivo={selectedEvento.motivo}
        />
      )}
    </DashboardLayout>
  );
}
