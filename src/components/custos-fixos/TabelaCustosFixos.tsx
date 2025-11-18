import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustoFixo } from "@/types/custoFixo";
import { Evento } from "@/types/evento";
import { Trash2, Receipt } from "lucide-react";

interface TabelaCustosFixosProps {
  custos: CustoFixo[];
  eventos: Evento[];
  onDelete: (id: string) => void;
}

const tiposGastoLabels: Record<string, string> = {
  internet: "Internet",
  aluguel: "Aluguel",
  agua: "Água",
  energia: "Energia",
  gasolina: "Gasolina",
  outros: "Outros",
};

export const TabelaCustosFixos = ({ custos, eventos, onDelete }: TabelaCustosFixosProps) => {
  const getEventoNome = (eventoId?: string) => {
    if (!eventoId || eventoId === "none") return "-";
    const evento = eventos.find(e => e.id === eventoId);
    return evento ? evento.motivo : "Evento não encontrado";
  };

  if (custos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center h-full">
        <Receipt className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Nenhum Custo Fixo Registrado</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione um gasto para este mês para vê-lo aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-h-[500px] overflow-y-auto rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
          <TableRow>
            <TableHead className="w-[40%]">Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Evento Associado</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[100px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {custos.map((custo) => (
            <TableRow key={custo.id}>
              <TableCell className="font-medium">{custo.descricao}</TableCell>
              <TableCell>
                <Badge variant="outline">{tiposGastoLabels[custo.tipo] || "N/A"}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getEventoNome(custo.eventoId)}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {custo.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(custo.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};