import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CardEventoEscala } from "@/components/equipe/CardEventoEscala";
import { ModalEscalaEquipe } from "@/components/equipe/ModalEscalaEquipe";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Evento } from "@/types/evento";
import { eventosStorage } from "@/lib/eventosStorage";
import { escalasStorage } from "@/lib/equipeStorage";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Search } from "lucide-react";

export default function Escala() {
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [modalEscalaOpen, setModalEscalaOpen] = useState(false);
  const [modalVerMaisOpen, setModalVerMaisOpen] = useState(false);
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

  const eventosOrdenados = useMemo(() => [...eventos].sort((a, b) => {
    const hasEscalaA = escalasStorage.hasEscala(a.id);
    const hasEscalaB = escalasStorage.hasEscala(b.id);
    
    if (hasEscalaA === hasEscalaB) return 0;
    return hasEscalaA ? 1 : -1;
  }), [eventos]);

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

  const eventosPrincipais = filteredEventos.slice(0, 8);
  const eventosRestantes = filteredEventos.slice(8);

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

  return (
    <DashboardLayout
      title="Escala"
      description="Gerencie a escala de trabalho para os eventos"
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
        ) : eventos.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
            <p className="text-sm text-muted-foreground">Cadastre eventos para gerenciar a escala.</p>
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
              {eventosPrincipais.map(evento => (
                <CardEventoEscala
                  key={evento.id}
                  evento={evento}
                  hasEscala={escalasStorage.hasEscala(evento.id)}
                  onClick={() => handleOpenEscala(evento)}
                />
              ))}
            </div>

            {eventosRestantes.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setModalVerMaisOpen(true)}
                  className="min-w-[200px]"
                >
                  Ver mais eventos ({eventosRestantes.length})
                </Button>
              </div>
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

      {/* Modal: Ver Mais Eventos */}
      <Dialog open={modalVerMaisOpen} onOpenChange={setModalVerMaisOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Todos os Eventos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {eventosRestantes.map(evento => (
              <CardEventoEscala
                key={evento.id}
                evento={evento}
                hasEscala={escalasStorage.hasEscala(evento.id)}
                onClick={() => {
                  setModalVerMaisOpen(false);
                  handleOpenEscala(evento);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}