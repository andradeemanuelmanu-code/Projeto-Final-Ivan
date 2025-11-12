import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltroPeriodoProps {
  mesReferencia: string;
  onMesChange: (mes: string) => void;
}

export function FiltroPeriodo({ mesReferencia, onMesChange }: FiltroPeriodoProps) {
  const hoje = new Date();
  const meses = [];
  
  // Gerar últimos 12 meses
  for (let i = 0; i < 12; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    meses.push({
      valor: mesAno,
      label: data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    });
  }

  const handleFiltroRapido = (mesesAtras: number) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - mesesAtras, 1);
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    onMesChange(mesAno);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex-1 w-full sm:w-auto">
        <Select value={mesReferencia} onValueChange={onMesChange}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {meses.map((mes) => (
              <SelectItem key={mes.valor} value={mes.valor}>
                {mes.label.charAt(0).toUpperCase() + mes.label.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFiltroRapido(0)}
        >
          Mês Atual
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFiltroRapido(1)}
        >
          Último Mês
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFiltroRapido(2)}
        >
          2 Meses Atrás
        </Button>
      </div>
    </div>
  );
}
