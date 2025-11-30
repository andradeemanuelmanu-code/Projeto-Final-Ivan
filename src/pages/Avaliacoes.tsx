import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { eventosStorage } from "@/lib/eventosStorage";
import { escalasStorage, equipeStorage } from "@/lib/equipeStorage";
import { avaliacoesStorage } from "@/lib/avaliacoesStorage";
import { Evento } from "@/types/evento";
import { MembroEquipe, FuncaoEquipe } from "@/types/equipe";
import { EventoAvaliadoCard } from "@/components/avaliacoes/EventoAvaliadoCard";
import { ModalEquipeAvaliacao } from "@/components/avaliacoes/ModalEquipeAvaliacao";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MembroParaAvaliacao = MembroEquipe & { funcao: FuncaoEquipe };

const Avaliacoes = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [membrosEvento, setMembrosEvento] = useState<MembroParaAvaliacao[]>([]);
  const [modalEquipeOpen, setModalEquipeOpen] = useState(false);
  const [verMaisOpen, setVerMaisOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const CARDS_POR_PAGINA = 8;

  useEffect(() => {
    carregarEventos();
  }, [refreshKey]);

  const carregarEventos = () => {
    setLoading(true);
    
    setTimeout(() => {
      const todosEventos = eventosStorage.getAllSorted();
      
      const eventosComEscala = todosEventos.filter(evento => {
        const escala = escalasStorage.getByEventoId(evento.id);
        return escala && escala.membros.length > 0;
      });

      const eventosOrdenados = eventosComEscala.sort((a, b) => {
        const escalaA = escalasStorage.getByEventoId(a.id)!;
        const escalaB = escalasStorage.getByEventoId(b.id)!;
        
        const avaliadoA = avaliacoesStorage.isEventoAvaliado(a.id, escalaA.membros.length);
        const avaliadoB = avaliacoesStorage.isEventoAvaliado(b.id, escalaB.membros.length);

        if (avaliadoA === avaliadoB) return 0;
        return avaliadoA ? 1 : -1;
      });

      setEventos(eventosOrdenados);
      setLoading(false);
    }, 500);
  };

  const handleCardClick = (evento: Evento) => {
    const escala = escalasStorage.getByEventoId(evento.id);
    
    if (!escala || escala.membros.length === 0) {
      toast({
        title: "Sem equipe",
        description: "Este evento não possui membros escalados.",
        variant: "destructive",
      });
      return;
    }

    const membrosParaAvaliar = escala.membros
      .map(membroEscalado => {
        const membroInfo = equipeStorage.getById(membroEscalado.membroId);
        if (membroInfo) {
          return { ...membroInfo, funcao: membroEscalado.funcao };
        }
        return null;
      })
      .filter((m): m is MembroParaAvaliacao => m !== null);

    setEventoSelecionado(evento);
    setMembrosEvento(membrosParaAvaliar);
    setModalEquipeOpen(true);
  };

  const handleAvaliacaoSaved = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Avaliação registrada",
      description: "A avaliação foi salva com sucesso.",
    });
  };

  const filteredEventos = useMemo(() => {
    if (!searchTerm) {
      return eventos;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return eventos.filter(
      (evento) =>
        evento.motivo.toLowerCase().includes(lowercasedFilter) ||
        evento.cliente.nome.toLowerCase().includes(lowercasedFilter)
    );
  }, [eventos, searchTerm]);

  const eventosPrincipais = filteredEventos.slice(0, CARDS_POR_PAGINA);
  const eventosRestantes = filteredEventos.slice(CARDS_POR_PAGINA);

  return (
    <DashboardLayout
      title="Avaliações"
      description="Avalie o desempenho da equipe após os eventos"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum evento com equipe escalada encontrado.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Escale membros para eventos na página "Equipe" para poder avaliá-los.
            </p>
          </div>
        ) : filteredEventos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum evento encontrado.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tente ajustar seus termos de busca.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {eventosPrincipais.map((evento) => {
                const escala = escalasStorage.getByEventoId(evento.id);
                const totalMembros = escala?.membros.length || 0;
                const isAvaliado = avaliacoesStorage.isEventoAvaliado(evento.id, totalMembros);

                return (
                  <EventoAvaliadoCard
                    key={evento.id}
                    evento={evento}
                    isAvaliado={isAvaliado}
                    onClick={() => handleCardClick(evento)}
                  />
                );
              })}
            </div>

            {eventosRestantes.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVerMaisOpen(true)}
                  className="px-8"
                >
                  Ver mais eventos ({eventosRestantes.length})
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={verMaisOpen} onOpenChange={setVerMaisOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {eventosRestantes.map((evento) => {
              const escala = escalasStorage.getByEventoId(evento.id);
              const totalMembros = escala?.membros.length || 0;
              const isAvaliado = avaliacoesStorage.isEventoAvaliado(evento.id, totalMembros);

              return (
                <EventoAvaliadoCard
                  key={evento.id}
                  evento={evento}
                  isAvaliado={isAvaliado}
                  onClick={() => {
                    setVerMaisOpen(false);
                    handleCardClick(evento);
                  }}
                />
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {eventoSelecionado && (
        <ModalEquipeAvaliacao
          open={modalEquipeOpen}
          onOpenChange={setModalEquipeOpen}
          eventoNome={eventoSelecionado.motivo}
          eventoId={eventoSelecionado.id}
          membros={membrosEvento}
          onAvaliacaoSaved={handleAvaliacaoSaved}
        />
      )}
    </DashboardLayout>
  );
};

export default Avaliacoes;