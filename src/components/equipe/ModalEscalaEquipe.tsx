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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { membrosStorage, escalasStorage } from "@/lib/equipeStorage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";

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
  const membros = useMemo(() => membrosStorage.getAll(), []);

  const membrosAgrupados = useMemo(() => {
    return membros.reduce((acc, membro) => {
      const funcao = membro.funcao;
      if (!acc[funcao]) {
        acc[funcao] = [];
      }
      acc[funcao].push(membro);
      return acc;
    }, {} as Record<FuncaoEquipe, MembroEquipe[]>);
  }, [membros]);

  useEffect(() => {
    if (evento && open) {
      const escalaExistente = escalasStorage.getByEventoId(evento.id);
      if (escalaExistente) {
        setMembrosSelecionados(escalaExistente.membros);
      } else {
        setMembrosSelecionados([]);
      }
    }
  }, [evento, open]);

  const handleToggleMembro = (membroId: string) => {
    const jaExiste = membrosSelecionados.find(m => m.membroId === membroId);
    
    if (jaExiste) {
      setMembrosSelecionados(prev => prev.filter(m => m.membroId !== membroId));
    } else {
      const membro = membros.find(m => m.id === membroId);
      if (membro) {
        setMembrosSelecionados(prev => [...prev, { membroId, funcao: membro.funcao }]);
      }
    }
  };

  const handleSave = () => {
    if (!evento) return;

    escalasStorage.create({
      eventoId: evento.id,
      membros: membrosSelecionados,
    });

    onSave();
    onOpenChange(false);
  };

  if (!evento) return null;

  const dataFormatada = format(parseLocalDate(evento.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Escala de Equipe</DialogTitle>
          <DialogDescription>
            Selecione os membros para este evento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div>
              <Label className="text-muted-foreground text-xs">Evento</Label>
              <p className="font-medium">{evento.motivo}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Data</Label>
              <p className="font-medium">{dataFormatada}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-display">Equipe Designada</Label>
            
            {membros.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum membro cadastrado.</p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full" defaultValue={Object.keys(FUNCAO_LABELS)}>
                {Object.entries(membrosAgrupados).map(([funcao, membrosDoGrupo]) => (
                  <AccordionItem value={funcao} key={funcao}>
                    <AccordionTrigger className="font-medium">
                      {FUNCAO_LABELS[funcao as FuncaoEquipe] || funcao} ({membrosDoGrupo.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-2">
                        {membrosDoGrupo.map(membro => {
                          const isChecked = !!membrosSelecionados.find(m => m.membroId === membro.id);
                          return (
                            <div key={membro.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                              <Checkbox
                                id={`membro-${membro.id}`}
                                checked={isChecked}
                                onCheckedChange={() => handleToggleMembro(membro.id)}
                              />
                              <Label htmlFor={`membro-${membro.id}`} className="flex-1 min-w-0 cursor-pointer">
                                <p className="font-medium truncate">{membro.nome}</p>
                                <p className="text-sm text-muted-foreground truncate">{membro.email}</p>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#C44536] hover:bg-[#C44536]/90"
          >
            Salvar Escala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};