import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { EventCostCard } from "@/components/custos/EventCostCard";
import { AddCostModal } from "@/components/custos/AddCostModal";
import { CostListModal } from "@/components/custos/CostListModal";
import { ExecutedEventsList } from "@/components/custos/ExecutedEventsList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { eventosStorage } from "@/lib/eventosStorage";
import { custosStorage } from "@/lib/custosStorage";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { parseLocalDate } from "@/lib/utils";
import { CustoFormData } from "@/types/custo";

const ITEMS_PER_PAGE = 12;

export default function CustosPorEvento() {
  const [eventos] = useState(() => eventosStorage.getAllSorted());
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- State Management for Modals ---
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [modalView, setModalView] = useState<'list' | 'add' | null>(null);

  // --- Data Filtering and Sorting ---
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

  const filteredEventos = useMemo(() => {
    if (!searchTerm) {
      return eventosSorted;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return eventosSorted.filter(
      ({ evento }) =>
        evento.motivo.toLowerCase().includes(lowercasedFilter) ||
        evento.cliente.nome.toLowerCase().includes(lowercasedFilter)
    );
  }, [eventosSorted, searchTerm]);

  // --- Pagination Logic ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const pageCount = Math.ceil(filteredEventos.length / ITEMS_PER_PAGE);
  const eventosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEventos.slice(startIndex, endIndex);
  }, [filteredEventos, currentPage]);

  // --- Modal Handlers ---
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
    window.location.reload();
  };

  // --- Derived State for Modals ---
  const selectedEvento = useMemo(
    () => (selectedEventoId ? eventos.find((e) => e.id === selectedEventoId) : null),
    [selectedEventoId, eventos]
  );

  const custosForSelectedEvento = useMemo(
    () => (selectedEventoId ? custosStorage.getByEventoId(selectedEventoId) : []),
    [selectedEventoId]
  );

  // --- Pagination Rendering ---
  const renderPaginationItems = () => {
    if (pageCount <= 1) return null;

    const delta = 1;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < pageCount - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (pageCount > 1) {
      range.push(pageCount);
    }

    const uniqueRange = [...new Set(range)];

    return uniqueRange.map((item, index) => (
      <PaginationItem key={index}>
        {item === "..." ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            href="#"
            isActive={currentPage === item}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(item as number);
            }}
          >
            {item}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };

  return (
    <DashboardLayout
      title="Custos por Evento"
      description="Gerencie os gastos de cada evento e acompanhe os custos registrados"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por evento ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
              {eventosPaginados.map(({ evento, hasCosts }) => (
                <EventCostCard
                  key={evento.id}
                  evento={evento}
                  hasCosts={hasCosts}
                  onClick={() => handleCardClick(evento.id)}
                />
              ))}
            </div>

            {pageCount > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, pageCount));
                      }}
                      className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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

      {/* Modals */}
      <CostListModal
        open={modalView === 'list'}
        onClose={handleCloseModals}
        onAddCost={handleSwitchToAddCost}
        evento={selectedEvento}
        custos={custosForSelectedEvento}
      />
      <AddCostModal
        open={modalView === 'add'}
        onClose={handleCloseModals}
        onSave={handleSaveCost}
        eventoMotivo={selectedEvento?.motivo || ""}
      />
    </DashboardLayout>
  );
}