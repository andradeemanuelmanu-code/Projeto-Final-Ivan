import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CardEventoEscala } from "@/components/equipe/CardEventoEscala";
import { ModalEscalaEquipe } from "@/components/equipe/ModalEscalaEquipe";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Evento } from "@/types/evento";
import { eventosStorage } from "@/lib/eventosStorage";
import { escalasStorage } from "@/lib/equipeStorage";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Search } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

export default function Escala() {
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [modalEscalaOpen, setModalEscalaOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const eventosData = eventosStorage.getAllSorted();
      setEventos(eventosData);
      setLoading(false);
    }, 500);
  };

  const eventosFuturos = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return eventos.filter((evento) => parseLocalDate(evento.data) >= hoje);
  }, [eventos]);

  const eventosOrdenados = useMemo(() => [...eventosFuturos].sort((a, b) => {
    const hasEscalaA = escalasStorage.hasEscala(a.id);
    const hasEscalaB = escalasStorage.hasEscala(b.id);
    
    if (hasEscalaA === hasEscalaB) return 0;
    return hasEscalaA ? 1 : -1;
  }), [eventosFuturos]);

  const filteredEventos = useMemo(() => {
    if (!searchTerm) {
      return eventosOrdenados;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return eventosOrdenados.filter(
      (evento) =>
        evento.motivo.toLowerCase().includes(lowercasedFilter) ||
        evento.cliente.nome.toLowerCase().includes(lowercasedFilter)
    );
  }, [eventosOrdenados, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const pageCount = Math.ceil(filteredEventos.length / ITEMS_PER_PAGE);
  const eventosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEventos.slice(startIndex, endIndex);
  }, [filteredEventos, currentPage]);

  const handleOpenEscala = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalEscalaOpen(true);
  };

  const handleSaveEscala = () => {
    toast({
      title: "Escala salva com sucesso!",
      description: "A equipe foi designada para o evento.",
    });
    loadData();
  };

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
      title="Escala"
      description="Gerencie a escala de trabalho para os próximos eventos"
    >
      <div className="space-y-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por evento ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
          </div>
        ) : eventosFuturos.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Nenhum evento futuro cadastrado.</p>
            <p className="text-sm text-muted-foreground">Cadastre novos eventos para gerenciar a escala.</p>
          </div>
        ) : filteredEventos.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Search className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Nenhum evento encontrado.</p>
            <p className="text-sm text-muted-foreground">Tente ajustar seus termos de busca.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventosPaginados.map(evento => (
                <CardEventoEscala
                  key={evento.id}
                  evento={evento}
                  hasEscala={escalasStorage.hasEscala(evento.id)}
                  onClick={() => handleOpenEscala(evento)}
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
      </div>

      {/* Modal: Escala de Equipe */}
      <ModalEscalaEquipe
        open={modalEscalaOpen}
        onOpenChange={setModalEscalaOpen}
        evento={eventoSelecionado}
        onSave={handleSaveEscala}
      />
    </DashboardLayout>
  );
}