import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { EventoCard } from "@/components/eventos/EventoCard";
import { EventoModal } from "@/components/eventos/EventoModal";
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

const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | undefined>();
  const [eventoParaDeletar, setEventoParaDeletar] = useState<string | null>(null);

  const carregarEventos = () => {
    const eventosOrdenados = eventosStorage.getAllSorted();
    setEventos(eventosOrdenados);
  };

  useEffect(() => {
    carregarEventos();
  }, []);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Administração de Eventos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os eventos do buffet
            </p>
          </div>
          <Button
            onClick={handleNovoEvento}
            className="bg-primary hover:bg-primary/90 font-medium"
            size="lg"
          >
            <Plus size={20} className="mr-2" />
            Novo Evento
          </Button>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map(evento => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onEdit={handleEditar}
                onDelete={handleDeletar}
              />
            ))}
          </div>
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
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg md:hidden bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Plus size={24} />
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Eventos;
