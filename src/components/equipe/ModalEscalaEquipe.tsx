import { useState, useEffect } from "react";
import { Evento } from "@/types/evento";
import { FuncaoEquipe } from "@/types/equipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

const FUNCOES: { value: FuncaoEquipe; label: string }[] = [
  { value: "churrasqueiro", label: "Churrasqueiro" },
  { value: "auxiliar", label: "Auxiliar" },
  { value: "garcom", label: "Garçom" },
  { value: "cozinheiro", label: "Cozinheiro" },
  { value: "motorista", label: "Motorista" },
  { value: "bartender", label: "Bartender" },
  { value: "gerente", label: "Gerente" },
];

export const ModalEscalaEquipe = ({ open, onOpenChange, evento, onSave }: ModalEscalaEquipeProps) => {
  const [membrosSelecionados, setMembrosSelecionados] = useState<{ membroId: string; funcao: FuncaoEquipe }[]>([]);
  const membros = membrosStorage.getAll();

  useEffect(() => {
    if (evento && open) {
      // Carregar escala existente se houver
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
            Selecione os membros da equipe para este evento. A função principal de cada um será atribuída automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do Evento */}
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

          {/* Lista de Membros */}
          <div className="space-y-4">
            <Label className="text-base font-display">Equipe Designada</Label>
            
            {membros.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum membro cadastrado.</p>
                <p className="text-sm">Cadastre membros na seção "Membros da Equipe" abaixo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {membros.map(membro => {
                  const isChecked = membrosSelecionados.some(m => m.membroId === membro.id);

                  return (
                    <div key={membro.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleMembro(membro.id)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{membro.nome}</p>
                        <p className="text-sm text-muted-foreground truncate">{membro.email}</p>
                      </div>

                      {isChecked && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {FUNCOES.find(f => f.value === membro.funcao)?.label || membro.funcao}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
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
            disabled={membrosSelecionados.length === 0}
          >
            Salvar Escala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};