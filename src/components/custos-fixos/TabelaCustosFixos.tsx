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
    <div className="md:border md:rounded-lg">
      {/* Header for Desktop */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b font-medium text-muted-foreground bg-muted/50">
        <div className="text-left">Descrição</div>
        <div className="text-left">Tipo</div>
        <div className="text-left">Evento Associado</div>
        <div className="text-right">Valor</div>
        <div className="text-center">Ações</div>
      </div>

      {/* Scrollable container */}
      <div className="max-h-[500px] overflow-y-auto">
        <div className="space-y-4 p-4 md:p-0 md:space-y-0">
          {custos.map((custo) => (
            <div
              key={custo.id}
              className="p-4 border rounded-lg 
                         md:p-0 md:border-0 md:rounded-none 
                         md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4 md:items-center 
                         md:px-4 md:py-3 md:border-t first:md:border-t-0"
            >
              {/* Coluna 1: Descrição e Valor (Mobile) */}
              <div className="flex justify-between items-start md:block">
                <div className="font-medium md:font-normal pr-2">{custo.descricao}</div>
                <div className="md:hidden font-semibold text-lg shrink-0">
                  {custo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>

              {/* Coluna 2: Tipo */}
              <div className="flex justify-between items-center mt-2 md:mt-0">
                <span className="md:hidden text-sm text-muted-foreground">Tipo</span>
                <Badge variant="outline">{tiposGastoLabels[custo.tipo] || "N/A"}</Badge>
              </div>

              {/* Coluna 3: Evento */}
              <div className="flex justify-between items-center mt-1 md:mt-0">
                <span className="md:hidden text-sm text-muted-foreground">Evento</span>
                <span className="text-sm text-right md:text-left text-muted-foreground">
                  {getEventoNome(custo.eventoId)}
                </span>
              </div>

              {/* Coluna 4: Valor (Desktop) */}
              <div className="hidden md:block text-right font-semibold">
                {custo.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>

              {/* Coluna 5: Ações */}
              <div className="flex justify-end mt-2 md:mt-0 md:justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(custo.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};