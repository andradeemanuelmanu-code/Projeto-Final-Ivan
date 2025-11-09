import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustoFixo } from "@/types/custoFixo";
import { Evento } from "@/types/evento";

interface FixedCostCardProps {
  custo: CustoFixo;
  evento?: Evento;
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

export const FixedCostCard = ({ custo, evento, onDelete }: FixedCostCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-foreground">{custo.descricao}</h3>
              <p className="text-sm text-muted-foreground">{tiposGastoLabels[custo.tipo]}</p>
            </div>
            <p className="font-semibold text-lg text-foreground">
              {custo.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          
          {evento && (
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">
                {evento.motivo}
              </span>
            </div>
          )}
        </div>

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
  );
};
