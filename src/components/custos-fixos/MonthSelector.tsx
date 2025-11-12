import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MonthSelector = ({ value, onChange }: MonthSelectorProps) => {
  const meses = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const anoAtual = new Date().getFullYear();
  const anos = [anoAtual - 1, anoAtual, anoAtual + 1];

  const [ano, mes] = value.split("-");

  const handleMesChange = (novoMes: string) => {
    onChange(`${ano}-${novoMes}`);
  };

  const handleAnoChange = (novoAno: string) => {
    onChange(`${novoAno}-${mes}`);
  };

  const mesNome = meses.find((m) => m.value === mes)?.label || "";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="text-primary" size={20} />
        <span className="font-medium text-foreground">Exibindo Custos Fixos de</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={mes} onValueChange={handleMesChange}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ano} onValueChange={handleAnoChange}>
          <SelectTrigger className="w-[100px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {anos.map((a) => (
              <SelectItem key={a} value={a.toString()}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
