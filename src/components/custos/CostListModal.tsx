import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Evento } from "@/types/evento";
import { Custo, TipoCusto } from "@/types/custo";
import { Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";

interface CostListModalProps {
  open: boolean;
  onClose: () => void;
  onAddCost: () => void;
  evento: Evento | null;
  custos: Custo[];
}

const tipoCustoLabels: Record<TipoCusto, string> = {
  ingredientes: "Ingredientes",
  carvao: "Carvão",
  mercado: "Mercado",
  bebidas: "Bebidas",
  descartaveis: "Descartáveis",
  transporte: "Transporte",
  locacao: "Locação",
};

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

        <div className="flex-1 min-h-0 overflow-y-auto py-4">
          {custos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {custos.map((custo) => (
                    <TableRow key={custo.id}>
                      <TableCell className="font-medium">{custo.descricao}</TableCell>
                      <TableCell className="hidden md:table-cell">{tipoCustoLabels[custo.tipo] || "Outro"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {custo.data ? format(parseLocalDate(custo.data), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {custo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center h-full">
              <Receipt className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum Gasto Registrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique em "Adicionar Gasto" para começar.
              </p>
            </div>
          )}
        </div>

        {custos.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
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