import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { equipeStorage } from "@/lib/equipeStorage";
import { ApprovalModal } from "./ApprovalModal";
import { ModalMembro } from "@/components/equipe/ModalMembro";
import { FuncaoEquipe, MembroEquipe, MembroEquipeFormData } from "@/types/equipe";
import { UserCheck, UserX, UserPlus, Edit, Search } from "lucide-react";
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

const funcoesDisponiveis: { value: FuncaoEquipe | "todas"; label: string }[] = [
  { value: "todas", label: "Todas as Funções" },
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
  const [pendentes, setPendentes] = useState<MembroEquipe[]>([]);
  const [aprovados, setAprovados] = useState<MembroEquipe[]>([]);
  
  // Estados para modais e diálogos
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  
  // Estados para seleção
  const [usuarioParaAprovar, setUsuarioParaAprovar] = useState<MembroEquipe | null>(null);
  const [usuarioParaRejeitar, setUsuarioParaRejeitar] = useState<MembroEquipe | null>(null);
  const [membroParaEditar, setMembroParaEditar] = useState<MembroEquipe | null>(null);

  // Estados para busca e filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFunction, setFilterFunction] = useState<FuncaoEquipe | "todas">("todas");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPendentes(equipeStorage.getPendentes());
    setAprovados(equipeStorage.getAtivos());
  };

  const handleAprovarClick = (usuario: MembroEquipe) => {
    setUsuarioParaAprovar(usuario);
    setApprovalModalOpen(true);
  };

  const handleConfirmarAprovacao = (funcaoPrincipal: FuncaoEquipe, funcoesSecundarias: FuncaoEquipe[]) => {
    if (!usuarioParaAprovar) return;
    equipeStorage.aprovar(usuarioParaAprovar.id, funcaoPrincipal, funcoesSecundarias);
    toast({
      title: "Membro aprovado",
      description: `${usuarioParaAprovar.nome} foi adicionado à equipe.`,
    });
    loadData();
  };

  const handleRejeitarClick = (usuario: MembroEquipe) => {
    setUsuarioParaRejeitar(usuario);
    setRejectionDialogOpen(true);
  };

  const handleConfirmarRejeicao = () => {
    if (!usuarioParaRejeitar) return;
    equipeStorage.delete(usuarioParaRejeitar.id);
    toast({
      title: "Solicitação rejeitada",
      description: `${usuarioParaRejeitar.nome} foi rejeitado.`,
      variant: "destructive",
    });
    loadData();
  };

  const handleEditarClick = (membro: MembroEquipe) => {
    setMembroParaEditar(membro);
    setEditModalOpen(true);
  };

  const handleSaveMembro = (data: MembroEquipeFormData) => {
    if (!membroParaEditar) return;
    equipeStorage.update(membroParaEditar.id, data);
    toast({
      title: "Membro atualizado",
      description: "As informações foram salvas com sucesso.",
    });
    loadData();
  };

  const filteredAprovados = useMemo(() => {
    return aprovados
      .filter(membro => {
        const term = searchTerm.toLowerCase();
        return membro.nome.toLowerCase().includes(term) || membro.email.toLowerCase().includes(term);
      })
      .filter(membro => {
        return filterFunction === "todas" || membro.funcaoPrincipal === filterFunction;
      });
  }, [aprovados, searchTerm, filterFunction]);

  return (
    <>
      <Card>
        <CardContent className="space-y-6 pt-6">
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
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium truncate" title={usuario.nome}>{usuario.nome}</p>
                      <p className="text-sm text-muted-foreground truncate" title={usuario.email}>{usuario.email}</p>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pendente
                      </Badge>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        size="sm"
                        onClick={() => handleAprovarClick(usuario)}
                        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejeitarClick(usuario)}
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
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Membros Ativos
            </h3>
            
            {/* Filtros e Busca */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou e-mail..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterFunction} onValueChange={(v) => setFilterFunction(v as FuncaoEquipe | "todas")}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {funcoesDisponiveis.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredAprovados.length > 0 ? (
              <div className="space-y-2">
                {filteredAprovados.map((membro) => (
                  <div
                    key={membro.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="flex justify-between items-start flex-1 min-w-0">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium truncate" title={membro.nome}>{membro.nome}</p>
                        <p className="text-sm text-muted-foreground truncate" title={membro.email}>{membro.email}</p>
                      </div>
                      <Badge className="bg-green-600 flex-shrink-0">Ativo</Badge>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto md:max-w-[250px]">
                      <Select
                        value={membro.funcaoPrincipal}
                        onValueChange={(value) => equipeStorage.update(membro.id, { funcaoPrincipal: value as FuncaoEquipe }) && loadData()}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {funcoesDisponiveis.filter(f => f.value !== 'todas').map((funcao) => (
                            <SelectItem key={funcao.value} value={funcao.value}>
                              {funcao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => handleEditarClick(membro)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum membro encontrado com os filtros aplicados.</p>
              </div>
            )}
          </div>

          {pendentes.length === 0 && aprovados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum membro cadastrado ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ApprovalModal
        open={approvalModalOpen}
        onOpenChange={setApprovalModalOpen}
        usuarioNome={usuarioParaAprovar?.nome || ""}
        onAprovar={handleConfirmarAprovacao}
      />

      <ModalMembro
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        membro={membroParaEditar}
        onSave={handleSaveMembro}
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