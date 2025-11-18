import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CardEventoEscala } from "@/components/equipe/CardEventoEscala";
import { ModalEscalaEquipe } from "@/components/equipe/ModalEscalaEquipe";
import { ModalMembro } from "@/components/equipe/ModalMembro";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Evento } from "@/types/evento";
import { MembroEquipe, MembroEquipeFormData } from "@/types/equipe";
import { eventosStorage } from "@/lib/eventosStorage";
import { membrosStorage, escalasStorage } from "@/lib/equipeStorage";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Users, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FUNCOES_LABEL: Record<string, string> = {
  cozinheira: "Cozinheira",
  "ajudante-cozinheira": "Ajudante de Cozinheira",
  churrasqueiro: "Churrasqueiro",
  "ajudante-churrasqueiro": "Ajudante de Churrasqueiro",
  garcom: "Garçom",
  barman: "Barman",
  maitre: "Maître",
};

export default function Equipe() {
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [membroSelecionado, setMembroSelecionado] = useState<MembroEquipe | null>(null);
  const [membroParaExcluir, setMembroParaExcluir] = useState<string | null>(null);
  const [modalEscalaOpen, setModalEscalaOpen] = useState(false);
  const [modalMembroOpen, setModalMembroOpen] = useState(false);
  const [modalVerMaisOpen, setModalVerMaisOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const eventosData = eventosStorage.getAllSorted();
      const membrosData = membrosStorage.getAll();
      setEventos(eventosData);
      setMembros(membrosData);
      setLoading(false);
    }, 500);
  };

  const eventosOrdenados = [...eventos].sort((a, b) => {
    const hasEscalaA = escalasStorage.hasEscala(a.id);
    const hasEscalaB = escalasStorage.hasEscala(b.id);
    
    if (hasEscalaA === hasEscalaB) return 0;
    return hasEscalaA ? 1 : -1;
  });

  const eventosPrincipais = eventosOrdenados.slice(0, 8);
  const eventosRestantes = eventosOrdenados.slice(8);

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

  const handleEditMembro = (membro: MembroEquipe) => {
    setMembroSelecionado(membro);
    setModalMembroOpen(true);
  };

  const handleSaveMembro = (data: MembroEquipeFormData) => {
    if (membroSelecionado) {
      membrosStorage.update(membroSelecionado.id, data);
      toast({
        title: "Membro atualizado!",
        description: "As informações do membro foram atualizadas.",
      });
    } else {
      membrosStorage.create(data);
      toast({
        title: "Membro adicionado!",
        description: "Novo membro cadastrado na equipe.",
      });
    }
    loadData();
  };

  const handleDeleteMembro = (id: string) => {
    membrosStorage.delete(id);
    toast({
      title: "Membro excluído",
      description: "O membro foi removido da equipe.",
    });
    setMembroParaExcluir(null);
    loadData();
  };

  return (
    <DashboardLayout
      title="Equipe"
      description="Gerencie a escala de trabalho e os membros da equipe"
    >
      <div className="space-y-8">
        {/* Seção: Escala de Eventos */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary" size={24} />
            <h2 className="font-display font-semibold text-2xl text-foreground">Escala de Eventos</h2>
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
        </section>

        <Separator className="my-8" />

        {/* Seção: Membros da Equipe */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users className="text-primary" size={24} />
              <h2 className="font-display font-semibold text-2xl text-foreground">Membros da Equipe</h2>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : membros.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Users className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">Nenhum membro cadastrado.</p>
              <p className="text-sm text-muted-foreground">Adicione membros para gerenciar a equipe.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membros.map(membro => (
                    <TableRow key={membro.id}>
                      <TableCell className="font-medium">{membro.nome}</TableCell>
                      <TableCell>{FUNCOES_LABEL[membro.funcao]}</TableCell>
                      <TableCell>{membro.telefone}</TableCell>
                      <TableCell>{membro.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMembro(membro)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMembroParaExcluir(membro.id)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>

      {/* Modal: Escala de Equipe */}
      <ModalEscalaEquipe
        open={modalEscalaOpen}
        onOpenChange={setModalEscalaOpen}
        evento={eventoSelecionado}
        onSave={handleSaveEscala}
      />

      {/* Modal: Adicionar/Editar Membro */}
      <ModalMembro
        open={modalMembroOpen}
        onOpenChange={setModalMembroOpen}
        membro={membroSelecionado}
        onSave={handleSaveMembro}
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

      {/* AlertDialog: Confirmar Exclusão */}
      <AlertDialog open={!!membroParaExcluir} onOpenChange={() => setMembroParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => membroParaExcluir && handleDeleteMembro(membroParaExcluir)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}