import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MembroEquipe } from "@/types/equipe";

interface ModalSelecaoFuncaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcaoLabel: string;
  membrosDaFuncao: MembroEquipe[];
  membrosJaSelecionados: string[];
  onSaveSelecao: (selecionados: string[]) => void;
}

export const ModalSelecaoFuncao = ({
  open,
  onOpenChange,
  funcaoLabel,
  membrosDaFuncao,
  membrosJaSelecionados,
  onSaveSelecao,
}: ModalSelecaoFuncaoProps) => {
  const [selecaoAtual, setSelecaoAtual] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelecaoAtual(membrosJaSelecionados);
    }
  }, [open, membrosJaSelecionados]);

  const handleToggleMembro = (membroId: string) => {
    setSelecaoAtual(prev =>
      prev.includes(membroId)
        ? prev.filter(id => id !== membroId)
        : [...prev, membroId]
    );
  };

  const handleSave = () => {
    onSaveSelecao(selecaoAtual);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Selecionar {funcaoLabel}</DialogTitle>
          <DialogDescription>
            Marque os membros que participarão do evento nesta função.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 pr-4">
          <div className="space-y-3 py-4">
            {membrosDaFuncao.map(membro => (
              <div
                key={membro.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`membro-sel-${membro.id}`}
                  checked={selecaoAtual.includes(membro.id)}
                  onCheckedChange={() => handleToggleMembro(membro.id)}
                />
                <Label
                  htmlFor={`membro-sel-${membro.id}`}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <p className="font-medium truncate">{membro.nome}</p>
                  <p className="text-sm text-muted-foreground truncate">{membro.email}</p>
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Confirmar Seleção</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};