import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, parseLocalDate } from "@/lib/utils";
import { TipoCustoFixo } from "@/types/custoFixo";

interface AddFixedCostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    descricao: string;
    tipo: TipoCustoFixo;
    valor: number;
    data: string;
  }) => void;
}

const tiposGasto: Array<{ value: TipoCustoFixo; label: string }> = [
  { value: "internet", label: "Internet" },
  { value: "aluguel", label: "Aluguel" },
  { value: "agua", label: "Água" },
  { value: "energia", label: "Energia" },
  { value: "gasolina", label: "Gasolina" },
  { value: "outros", label: "Outros" },
];

export const AddFixedCostModal = ({
  open,
  onOpenChange,
  onSave,
}: AddFixedCostModalProps) => {
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoCustoFixo>("internet");
  const [valor, setValor] = useState("");
  const [data, setData] = useState<Date | undefined>(new Date());

  const handleSave = () => {
    if (!descricao || !valor || !data) return;

    onSave({
      descricao,
      tipo,
      valor: parseFloat(valor.replace(/[^\d,]/g, "").replace(",", ".")),
      data: format(data, "yyyy-MM-dd"),
    });

    // Reset form
    setDescricao("");
    setTipo("internet");
    setValor("");
    setData(new Date());
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDescricao("");
    setTipo("internet");
    setValor("");
    setData(new Date());
    onOpenChange(false);
  };

  const formatarValor = (value: string) => {
    const numero = value.replace(/[^\d]/g, "");
    if (!numero) return "";
    const valorNumerico = parseInt(numero) / 100;
    return valorNumerico.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValor(e.target.value);
    setValor(valorFormatado);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Adicionar Custo Fixo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Conta de luz de novembro"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Gasto</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as TipoCustoFixo)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {tiposGasto.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total (R$)</Label>
              <Input
                id="valor"
                value={valor}
                onChange={handleValorChange}
                placeholder="0,00"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data do Custo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "dd/MM/yyyy") : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!descricao || !valor || !data}
            className="bg-accent hover:bg-accent/90"
          >
            Salvar Gasto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};