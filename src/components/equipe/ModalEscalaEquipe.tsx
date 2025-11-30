import { useState, useEffect, useMemo } from "react";
import { Evento } from "@/types/evento";
import { MembroEscalado, MembroEquipe, FuncaoEquipe } from "@/types/equipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { equipeStorage, escalasStorage } from "@/lib/equipeStorage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarOpcoes, parseLocalDate } from "@/lib/utils";
import { Users, UtensilsCrossed, GlassWater, Trash2 } from "lucide-react";
import { ModalSelecaoFuncao } from "./ModalSelecaoFuncao";
import { Separator } from "@/components/ui/separator";
import { opcoesStorage } from "@/lib/opcoesStorage";

interface ModalEscalaEquipeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evento: Evento | null;
  onSave: () => void;
}

const FUNCAO_LABELS: Record<FuncaoEquipe, string> = {
  cozinheira: "Cozinheiras",
  "ajudante-cozinheira": "Ajudantes de Cozinha",
  churrasqueiro: "Churrasqueiros",
  "ajudante-churrasqueiro": "Ajudantes de Churrasqueiro",
  garcom: "Garçons",
  barman: "Barmen",
  maitre: "Maîtres",
};

export const ModalEscalaEquipe = ({ open, onOpenChange, evento, onSave }: ModalEscalaEquipeProps) => {
  const [membrosSelecionados, setMembrosSelecionados] = useState<MembroEscalado[]>([]);
  const [modalFuncaoOpen, setModalFuncaoOpen] = useState(false);
  const [funcaoSelecionada, setFuncaoSelecionada] = useState<FuncaoEquipe | null>(null);
  
  const membros = useMemo(() => equipeStorage.getAtivos(), []);

  const membrosAgrupados = useMemo(() => {
    const agrupados: Record<string, MembroEquipe[]> = {};

    Object.keys(FUNCAO_LABELS).forEach(funcao => {
      agrupados[funcao] = [];
    });

    membros.forEach(membro => {
      const funcoes = new Set([membro.funcaoPrincipal, ...(membro.funcoesSecundarias || [])]);
      
      funcoes.forEach(funcao => {
        if (agrupados[funcao] && !agrupados[funcao].some(m => m.id === membro.id)) {
          agrupados[funcao].push(membro);
        }
      });
    });

    return agrupados;
  }, [membros]);

  useEffect(() => {
    if (evento && open) {
      const escalaExistente = escalasStorage.getByEventoId(evento.id);
      setMembrosSelecionados(escalaExistente ? escalaExistente.membros : []);
    }
  }, [evento, open]);

  const equipeEscaladaAgrupada = useMemo(() => {
    const agrupados: Record<string, { id: string; nome: string }[]> = {};

    membrosSelecionados.forEach(selecionado => {
      const membroInfo = membros.find(m => m.id === selecionado.membroId);
      if (membroInfo) {
        if (!agrupados[selecionado.funcao]) {
          agrupados[selecionado.funcao] = [];
        }
        agrupados[selecionado.funcao].push({ id: membroInfo.id, nome: membroInfo.nome });
      }
    });

    const sortedAgrupados: Record<string, { id: string; nome: string }[]> = {};
    Object.keys(FUNCAO_LABELS).forEach(funcaoKey => {
      if (agrupados[funcaoKey]) {
        sortedAgrupados[funcaoKey] = agrupados[funcaoKey];
      }
    });

    return sortedAgrupados;
  }, [membrosSelecionados, membros]);

  const handleRemoverMembro = (membroId: string) => {
    setMembrosSelecionados(prev => prev.filter(m => m.membroId !== membroId));
  };

  const handleAbrirModalFuncao = (funcao: FuncaoEquipe) => {
    setFuncaoSelecionada(funcao);
    setModalFuncaoOpen(true);
  };

  const handleSalvarSelecaoFuncao = (novosMembrosIds: string[]) => {
    if (!funcaoSelecionada) return;

    const outrosMembros = membrosSelecionados.filter(m => m.funcao !== funcaoSelecionada);
    const novosMembrosParaFuncao = novosMembrosIds.map(id => ({
      membroId: id,
      funcao: funcaoSelecionada,
    }));

    setMembrosSelecionados([...outrosMembros, ...novosMembrosParaFuncao]);
  };

  const handleSave = () => {
    if (!evento) return;
    escalasStorage.create({ eventoId: evento.id, membros: membrosSelecionados });
    onSave();
    onOpenChange(false);
  };

  if (!evento) return null;

  const dataFormatada = format(parseLocalDate(evento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  const cardapioFormatado = formatarOpcoes(evento.cardapio, opcoesStorage.getCardapioOptions);

  const bebidasFormatadas = evento.bebidas.length > 0
    ? evento.bebidas.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(", ")
    : "Não incluídas";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="font-display text-xl">Escala de Equipe</DialogTitle>
            <DialogDescription>
              Clique em uma função para selecionar os membros para este evento.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6">
            <div className="space-y-6 py-4">
              <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Evento</Label>
                  <p className="font-medium text-sm truncate">{evento.motivo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Data</Label>
                  <p className="font-medium text-sm">{dataFormatada}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <UtensilsCrossed size={12} />
                    Cardápio
                  </Label>
                  <p className="font-medium text-sm truncate">{cardapioFormatado}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <GlassWater size={12} />
                    Bebidas
                  </Label>
                  <p className="font-medium text-sm truncate">{bebidasFormatadas}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(membrosAgrupados).map(([funcao, membrosDoGrupo]) => {
                  const selecionadosNestaFuncao = membrosSelecionados.filter(m => m.funcao === funcao).length;
                  return (
                    <Card
                      key={funcao}
                      className="cursor-pointer hover:shadow-md hover:border-primary transition-all"
                      onClick={() => handleAbrirModalFuncao(funcao as FuncaoEquipe)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Users size={18} className="text-primary" />
                          {FUNCAO_LABELS[funcao as FuncaoEquipe] || funcao}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xl font-bold">
                          {selecionadosNestaFuncao}
                          <span className="text-sm font-normal text-muted-foreground">
                            {" "}
                            / {membrosDoGrupo.length} selecionados
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Equipe Escalada ({membrosSelecionados.length})</h3>
                {membrosSelecionados.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                    <p>Nenhum membro selecionado.</p>
                    <p className="text-sm">Clique em uma função acima para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(equipeEscaladaAgrupada).map(([funcao, membrosDaFuncao]) => (
                      <div key={funcao}>
                        <Label className="text-muted-foreground">
                          {FUNCAO_LABELS[funcao as FuncaoEquipe] || funcao}
                        </Label>
                        <div className="mt-2 space-y-2">
                          {membrosDaFuncao.map(membro => (
                            <div key={membro.id} className="flex items-center justify-between p-2 border rounded-md bg-background">
                              <span className="text-sm">{membro.nome}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleRemoverMembro(membro.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#C44536] hover:bg-[#C44536]/90">
              Salvar Escala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {funcaoSelecionada && (
        <ModalSelecaoFuncao
          open={modalFuncaoOpen}
          onOpenChange={setModalFuncaoOpen}
          funcaoLabel={FUNCAO_LABELS[funcaoSelecionada]}
          membrosDaFuncao={membrosAgrupados[funcaoSelecionada] || []}
          membrosJaSelecionados={membrosSelecionados
            .filter(m => m.funcao === funcaoSelecionada)
            .map(m => m.membroId)}
          onSaveSelecao={handleSalvarSelecaoFuncao}
        />
      )}
    </>
  );
};