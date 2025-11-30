import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotaFiscal, SituacaoImposto } from "@/types/notaFiscal";
import { Evento } from "@/types/evento";

interface ModalEditarSituacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota: NotaFiscal | null;
  evento: Evento | undefined;
  onSave: (id: string, situacao: SituacaoImposto) => void;
}

export function ModalEditarSituacao({ open, onOpenChange, nota, evento, onSave }: ModalEditarSituacaoProps) {
  const [situacao, setSituacao] = useState<SituacaoImposto>("pendente");

  useEffect(() => {
    if (nota) {
      setSituacao(nota.situacaoImposto);
    }
  }, [nota]);

  const handleSave = () => {
    if (nota) {
      onSave(nota.id, situacao);
    }
  };

  if (!nota || !evento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Situação do Imposto</DialogTitle>
          <DialogDescription>
            Atualize o status de pagamento do imposto para o evento: <strong>{evento.motivo}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Valor do Imposto:</p>
            <p className="text-2xl font-bold text-accent">
              {nota.valorImposto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Situação do Imposto *</Label>
            <RadioGroup value={situacao} onValueChange={(v: SituacaoImposto) => setSituacao(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pago" id="edit-pago" />
                <Label htmlFor="edit-pago" className="font-normal cursor-pointer">Pago</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pendente" id="edit-pendente" />
                <Label htmlFor="edit-pendente" className="font-normal cursor-pointer">Pendente</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}