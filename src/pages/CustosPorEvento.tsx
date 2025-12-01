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

const FUTURE_ITEMS_PER_PAGE = 12;
const EXECUTED_ITEMS_PER_PAGE = 10;

export default function CustosPorEvento() {
  const [eventos] = useState(() => eventosStorage.getAllSorted());
  const [isLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [executedCurrentPage, setExecutedCurrentPage] = useState(1);

  // --- State Management for Modals ---
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [modalView, setModalView] = useState<'list' | 'add' | null>(null);

  // --- Data Filtering and Sorting for Future Events ---
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

  // --- Pagination Logic for Future Events ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const pageCount = Math.ceil(filteredEventos.length / FUTURE_ITEMS_PER_PAGE);
  const eventosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * FUTURE_ITEMS_PER_PAGE;
    const endIndex = startIndex + FUTURE_ITEMS_PER_PAGE;
    return filteredEventos.slice(startIndex, endIndex);
  }, [filteredEventos, currentPage]);

  // --- Data Filtering and Pagination for Executed Events ---
  const executedEventsSorted = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return eventos
      .filter((evento) => parseLocalDate(evento.data) < hoje)
      .sort((a, b) => parseLocalDate(b.data).getTime() - parseLocalDate(a.data).getTime());
  }, [eventos]);

  const executedPageCount = Math.ceil(executedEventsSorted.length / EXECUTED_ITEMS_PER_PAGE);
  const paginatedExecutedEvents = useMemo(() => {
    const startIndex = (executedCurrentPage - 1) * EXECUTED_ITEMS_PER_PAGE;
    const endIndex = startIndex + EXECUTED_ITEMS_PER_PAGE;
    return executedEventsSorted.slice(startIndex, endIndex);
  }, [executedEventsSorted, executedCurrentPage]);

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
  const renderPaginationItems = (
    totalPages: number,
    activePage: number,
    setPage: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    const delta = 1;
    const range = [];
    for (let i = Math.max(2, activePage - delta); i <= Math.min(totalPages - 1, activePage + delta); i++) {
      range.push(i);
    }

    if (activePage - delta > 2) range.unshift("...");
    if (activePage + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    const uniqueRange = [...new Set(range)];

    return uniqueRange.map((item, index) => (
      <PaginationItem key={index}>
        {item === "..." ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            href="#"
            isActive={activePage === item}
            onClick={(e) => {
              e.preventDefault();
              setPage(item as number);
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

        {/* Cards de Eventos Futuros */}
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
                  {renderPaginationItems(pageCount, currentPage, setCurrentPage)}
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
        <div className="space-y-6 pt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Eventos Executados
          </h2>
          <ExecutedEventsList eventos={paginatedExecutedEvents} onEventoClick={handleCardClick} />
          {executedPageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setExecutedCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={executedCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {renderPaginationItems(executedPageCount, executedCurrentPage, setExecutedCurrentPage)}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setExecutedCurrentPage((prev) => Math.min(prev + 1, executedPageCount));
                    }}
                    className={executedCurrentPage === executedPageCount ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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