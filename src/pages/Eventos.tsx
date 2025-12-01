import { useState, useEffect, useMemo } from "react";
import { Plus, ListPlus, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventoCard } from "@/components/eventos/EventoCard";
import { EventoModal } from "@/components/eventos/EventoModal";
import { GerenciarOpcoesModal } from "@/components/eventos/GerenciarOpcoesModal";
import { ModalGerenciamentoPagamento } from "@/components/eventos/ModalGerenciamentoPagamento";
import { eventosStorage } from "@/lib/eventosStorage";
import { Evento, EventoFormData } from "@/types/evento";
import { toast } from "@/hooks/use-toast";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { parseLocalDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // States for modals
  const [modalOpen, setModalOpen] = useState(false);
  const [gerenciarOpcoesOpen, setGerenciarOpcoesOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // States for selected items
  const [eventoEditando, setEventoEditando] = useState<Evento | undefined>();
  const [eventoParaDeletar, setEventoParaDeletar] = useState<string | null>(null);
  const [eventoParaPagamento, setEventoParaPagamento] = useState<Evento | null>(null);

  const carregarEventos = () => {
    const eventosCarregados = eventosStorage.getAll(); // Carrega todos sem ordenação inicial
    setEventos(eventosCarregados);
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const eventosOrdenados = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const eventosFuturos = eventos
      .filter(e => parseLocalDate(e.data) >= hoje)
      .sort((a, b) => parseLocalDate(a.data).getTime() - parseLocalDate(b.data).getTime());

    const eventosPassados = eventos
      .filter(e => parseLocalDate(e.data) < hoje)
      .sort((a, b) => parseLocalDate(b.data).getTime() - parseLocalDate(a.data).getTime());

    return [...eventosFuturos, ...eventosPassados];
  }, [eventos]);

  const filteredEventos = useMemo(() => {
    if (!searchTerm) {
      return eventosOrdenados;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return eventosOrdenados.filter(
      (evento) =>
        evento.motivo.toLowerCase().includes(lowercasedFilter) ||
        evento.cliente.nome.toLowerCase().includes(lowercasedFilter) ||
        evento.endereco.toLowerCase().includes(lowercasedFilter)
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

  const handleSalvar = (data: EventoFormData) => {
    if (eventoEditando) {
      eventosStorage.update(eventoEditando.id, data);
      toast({
        title: "Evento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      eventosStorage.create(data);
      toast({
        title: "Evento criado",
        description: "O novo evento foi adicionado à lista.",
      });
    }
    carregarEventos();
    setModalOpen(false);
    setEventoEditando(undefined);
  };

  const handleEditar = (evento: Evento) => {
    setEventoEditando(evento);
    setModalOpen(true);
  };

  const handleDeletar = (id: string) => {
    setEventoParaDeletar(id);
  };

  const confirmarDelecao = () => {
    if (eventoParaDeletar) {
      eventosStorage.delete(eventoParaDeletar);
      toast({
        title: "Evento excluído",
        description: "O evento foi removido da lista.",
        variant: "destructive",
      });
      carregarEventos();
      setEventoParaDeletar(null);
    }
  };

  const handleNovoEvento = () => {
    setEventoEditando(undefined);
    setModalOpen(true);
  };

  // Handlers for payment modal
  const handleOpenPaymentModal = (evento: Evento) => {
    setEventoParaPagamento(evento);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (data: Partial<Evento>) => {
    if (eventoParaPagamento) {
      eventosStorage.update(eventoParaPagamento.id, data);
      toast({
        title: "Pagamento atualizado",
        description: "As informações de pagamento foram salvas.",
      });
      carregarEventos();
      setIsPaymentModalOpen(false);
      setEventoParaPagamento(null);
    }
  };

  const renderPaginationItems = () => {
    if (pageCount <= 1) return null;

    const delta = 1;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < pageCount - 1) range.push("...");

    range.unshift(1);
    if (pageCount > 1) range.push(pageCount);

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
      title="Administração de Eventos"
      description="Gerencie todos os eventos do buffet"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por motivo, cliente, endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row sm:items-center">
            <Button
              onClick={() => setGerenciarOpcoesOpen(true)}
              variant="outline"
              className="hidden sm:flex"
            >
              <ListPlus size={20} className="mr-2" />
              Gerenciar Opções
            </Button>
            <Button
              onClick={handleNovoEvento}
              className="bg-primary hover:bg-primary/90 font-medium hidden sm:flex"
              size="lg"
            >
              <Plus size={20} className="mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {/* Lista de Eventos */}
        {eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Nenhum evento cadastrado</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Comece criando seu primeiro evento clicando no botão acima
            </p>
            <Button onClick={handleNovoEvento} variant="outline">
              Criar Primeiro Evento
            </Button>
          </div>
        ) : filteredEventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Tente ajustar seus termos de busca ou cadastre um novo evento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {eventosPaginados.map((evento) => (
                <EventoCard
                  key={evento.id}
                  evento={evento}
                  onEdit={handleEditar}
                  onDelete={handleDeletar}
                  onManagePayment={handleOpenPaymentModal}
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

        {/* Modal de Criação/Edição */}
        <EventoModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEventoEditando(undefined);
          }}
          onSave={handleSalvar}
          evento={eventoEditando}
        />

        {/* Modal de Gerenciamento de Opções */}
        <GerenciarOpcoesModal
          open={gerenciarOpcoesOpen}
          onOpenChange={setGerenciarOpcoesOpen}
        />

        {/* Payment Management Modal */}
        <ModalGerenciamentoPagamento
          open={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setEventoParaPagamento(null);
          }}
          onSave={handleSavePayment}
          evento={eventoParaPagamento}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!eventoParaDeletar} onOpenChange={() => setEventoParaDeletar(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmarDelecao}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Floating Action Button (Mobile) */}
        <Button
          onClick={handleNovoEvento}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg sm:hidden bg-primary hover:bg-primary/90 z-40"
          size="icon"
          aria-label="Novo Evento"
        >
          <Plus size={24} />
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Eventos;