import { Custo, TipoCusto } from "@/types/custo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";
import { Tag, Calendar } from "lucide-react";

interface CostItemProps {
  custo: Custo;
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

export function CostItem({ custo }: CostItemProps) {
  const valorFormatado = custo.valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const dataFormatada = custo.data
    ? format(parseLocalDate(custo.data), "dd/MM/yyyy", {
        locale: ptBR,
      })
    : "Data não informada";

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1 space-y-2">
        <p className="font-medium text-foreground">{custo.descricao}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            <span>{tipoCustoLabels[custo.tipo] || "Outro"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{dataFormatada}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg text-foreground">{valorFormatado}</p>
      </div>
    </div>
  );
}