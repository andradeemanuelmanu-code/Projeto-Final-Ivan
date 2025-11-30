import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { EventCostCard } from "@/components/custos/EventCostCard";
import { AddCostModal } from "@/components/custos/AddCostModal";
import { CostListModal } from "@/components/custos/CostListModal";
import { ExecutedEventsList } from "@/components/custos/ExecutedEventsList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { eventosStorage } from "@/lib/eventosStorage";
import { custosStorage } from "@/lib/custosStorage";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { parseLocalDate } from "@/lib/utils";
import { CustoFormData } from "@/types/custo";

export default function CustosPorEvento() {
  const [eventos] = useState(() => eventosStorage.getAllSorted());
  const [isLoading] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);

  // --- State Management Refatorado ---
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [modalView, setModalView] = useState<'list' | 'add' | null>(null);

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

  // --- Funções de Manipulação de Modais Refatoradas ---
  const handleCardClick = (eventoId: string) => {
    setSelectedEventoId(eventoId);
    setModalView('list');
  };

  const handleSwitchToAddCost = () => {
    setModalView('add');
  };

  const handleCloseModals = () => {
    setSelectedEventoId(null);
    setModalView(null);
  };

  const handleSaveCost = (custoData: Omit<CustoFormData, "eventoId">) => {
    if (!selectedEventoId) return;

    custosStorage.create({
      ...custoData,
      eventoId: selectedEventoId,
    });

    toast({
      title: "Gasto adicionado com sucesso!",
      description: "O custo foi registrado no evento.",
    });

    handleCloseModals();
    // Recarregar para atualizar o status do card "hasCosts"
    // Em uma aplicação maior, usaríamos um gerenciador de estado para evitar o reload.
    window.location.reload(); 
  };

  // --- Variáveis Derivadas do Estado ---
  const selectedEvento = useMemo(
    () => (selectedEventoId ? eventos.find((e) => e.id === selectedEventoId) : null),
    [selectedEventoId, eventos]
  );

  const custosForSelectedEvento = useMemo(
    () => (selectedEventoId ? custosStorage.getByEventoId(selectedEventoId) : []),
    [selectedEventoId]
  );

  return (
    <DashboardLayout
      title="Custos por Evento"
      description="Gerencie os gastos de cada evento e acompanhe os custos registrados"
    >
      <div className="space-y-6">
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
                  onClick={() => handleCardClick(evento.id)}
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
          <ExecutedEventsList eventos={eventos} onEventoClick={handleCardClick} />
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
                    handleCardClick(evento.id);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal: Lista de Custos */}
      <CostListModal
        open={modalView === 'list'}
        onClose={handleCloseModals}
        onAddCost={handleSwitchToAddCost}
        evento={selectedEvento}
        custos={custosForSelectedEvento}
      />

      {/* Modal: Adicionar Custo */}
      <AddCostModal
        open={modalView === 'add'}
        onClose={handleCloseModals}
        onSave={handleSaveCost}
        eventoMotivo={selectedEvento?.motivo || ""}
      />
    </DashboardLayout>
  );
}