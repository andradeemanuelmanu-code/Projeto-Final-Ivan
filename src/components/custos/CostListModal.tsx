import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Evento } from "@/types/evento";
import { Custo } from "@/types/custo";
import { CostItem } from "./CostItem";
import { Receipt } from "lucide-react";

interface CostListModalProps {
  open: boolean;
  onClose: () => void;
  onAddCost: () => void;
  evento: Evento | null;
  custos: Custo[];
}

export function CostListModal({ open, onClose, onAddCost, evento, custos }: CostListModalProps) {
  if (!evento) return null;

  const totalGastos = custos.reduce((acc, custo) => acc + custo.valor, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Gastos do Evento: {evento.motivo}
          </DialogTitle>
          <DialogDescription>
            Visualize e adicione os gastos associados a este evento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {custos.length > 0 ? (
                custos.map((custo) => <CostItem key={custo.id} custo={custo} />)
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
                  <Receipt className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum Gasto Registrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Clique em "Adicionar Gasto" para começar.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {custos.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="font-semibold text-muted-foreground">Total de Gastos</span>
            <span className="font-bold text-xl text-foreground">
              {totalGastos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        )}

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Sair
          </Button>
          <Button onClick={onAddCost}>
            Adicionar Gasto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}