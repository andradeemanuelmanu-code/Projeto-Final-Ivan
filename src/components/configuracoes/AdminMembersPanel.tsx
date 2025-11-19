import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usuariosPendentesStorage } from "@/lib/usuariosStorage";
import { membrosStorage } from "@/lib/equipeStorage";
import { ApprovalModal } from "./ApprovalModal";
import { UsuarioPendente } from "@/types/usuario";
import { FuncaoEquipe, MembroEquipe } from "@/types/equipe";
import { UserCheck, UserX, Users, UserPlus, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const funcoesDisponiveis: { value: FuncaoEquipe; label: string }[] = [
  { value: "cozinheira", label: "Cozinheira" },
  { value: "ajudante-cozinheira", label: "Ajudante de Cozinheira" },
  { value: "churrasqueiro", label: "Churrasqueiro" },
  { value: "ajudante-churrasqueiro", label: "Ajudante de Churrasqueiro" },
  { value: "garcom", label: "Garçom" },
  { value: "barman", label: "Barman" },
  { value: "maitre", label: "Maître" },
];

export const AdminMembersPanel = () => {
  const { toast } = useToast();
  const [pendentes, setPendentes] = useState<UsuarioPendente[]>([]);
  const [aprovados, setAprovados] = useState<MembroEquipe[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioPendente | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [usuarioParaRejeitar, setUsuarioParaRejeitar] = useState<UsuarioPendente | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const todosPendentes = usuariosPendentesStorage.getAll();
    setPendentes(todosPendentes.filter((u) => u.status === "pendente"));
    setAprovados(membrosStorage.getAll());
  };

  const handleAprovar = (usuario: UsuarioPendente) => {
    setUsuarioSelecionado(usuario);
    setModalOpen(true);
  };

  const handleConfirmarAprovacao = (funcao: FuncaoEquipe) => {
    if (!usuarioSelecionado) return;

    membrosStorage.create({
      nome: usuarioSelecionado.nome,
      funcao,
      telefone: usuarioSelecionado.telefone,
      email: usuarioSelecionado.email,
    });

    usuariosPendentesStorage.aprovar(usuarioSelecionado.id);

    toast({
      title: "Membro aprovado",
      description: `${usuarioSelecionado.nome} foi adicionado à equipe.`,
    });

    loadData();
    setUsuarioSelecionado(null);
  };

  const handleRejeitar = (usuario: UsuarioPendente) => {
    setUsuarioParaRejeitar(usuario);
    setRejectionDialogOpen(true);
  };

  const handleConfirmarRejeicao = () => {
    if (!usuarioParaRejeitar) return;
    usuariosPendentesStorage.rejeitar(usuarioParaRejeitar.id);
    toast({
      title: "Solicitação rejeitada",
      description: `${usuarioParaRejeitar.nome} foi rejeitado.`,
      variant: "destructive",
    });
    loadData();
    setRejectionDialogOpen(false);
    setUsuarioParaRejeitar(null);
  };

  const handleEditarFuncao = (membroId: string, novaFuncao: FuncaoEquipe) => {
    const atualizado = membrosStorage.update(membroId, { funcao: novaFuncao });
    if (atualizado) {
      toast({
        title: "Função atualizada",
        description: "A função do membro foi alterada com sucesso.",
      });
      loadData();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Gerenciamento de Membros
              </CardTitle>
              <CardDescription>Aprove novos membros e gerencie funções</CardDescription>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-lg text-destructive">{pendentes.length}</p>
                <p className="text-muted-foreground">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg text-green-600">{aprovados.length}</p>
                <p className="text-muted-foreground">Aprovados</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usuários Pendentes */}
          {pendentes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Solicitações Pendentes
              </h3>
              <div className="space-y-2">
                {pendentes.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{usuario.nome}</p>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        size="sm"
                        onClick={() => handleAprovar(usuario)}
                        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejeitar(usuario)}
                        className="flex-1 md:flex-none"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Membros Ativos */}
          {aprovados.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Membros Ativos
              </h3>
              <div className="space-y-2">
                {aprovados.map((membro) => (
                  <div
                    key={membro.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="flex justify-between items-start flex-1">
                      <div className="space-y-1">
                        <p className="font-medium">{membro.nome}</p>
                        <p className="text-sm text-muted-foreground">{membro.email}</p>
                      </div>
                      <Badge className="bg-green-600">Ativo</Badge>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto md:max-w-[250px]">
                      <Edit2 className="w-4 h-4 text-muted-foreground hidden md:block" />
                      <Select
                        value={membro.funcao}
                        onValueChange={(value) => handleEditarFuncao(membro.id, value as FuncaoEquipe)}
                      >
                        <SelectTrigger className="w-full md:w-[220px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {funcoesDisponiveis.map((funcao) => (
                            <SelectItem key={funcao.value} value={funcao.value}>
                              {funcao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendentes.length === 0 && aprovados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum membro cadastrado ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ApprovalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        usuarioNome={usuarioSelecionado?.nome || ""}
        onAprovar={handleConfirmarAprovacao}
      />

      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Rejeição</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja rejeitar a solicitação de{" "}
              <strong>{usuarioParaRejeitar?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarRejeicao}
              className="bg-destructive hover:bg-destructive/90"
            >
              Rejeitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};