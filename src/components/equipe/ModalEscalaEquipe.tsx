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
import { parseLocalDate } from "@/lib/utils";
import { Users, UtensilsCrossed, GlassWater } from "lucide-react";
import { ModalSelecaoFuncao } from "./ModalSelecaoFuncao";

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

const CARDAPIO_LABELS: Record<string, string> = {
  "churrasco-tradicional": "Churrasco Tradicional",
  "churrasco-prime": "Churrasco Prime",
  "churrasco-vip": "Churrasco VIP",
  "massas": "Massas",
  "roda-boteco": "Roda de Boteco",
  "coffee-break": "Coffee Break",
  "evento-kids": "Evento Kids",
  "jantar": "Jantar",
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
  
  const cardapioFormatado = evento.cardapio.length > 0
    ? evento.cardapio.map(c => CARDAPIO_LABELS[c] || c).join(", ")
    : "Não definido";

  const bebidasFormatadas = evento.bebidas.length > 0
    ? evento.bebidas.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(", ")
    : "Não incluídas";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Escala de Equipe</DialogTitle>
            <DialogDescription>
              Clique em uma função para selecionar os membros para este evento.
            </DialogDescription>
          </DialogHeader>

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
          </div>

          <DialogFooter>
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