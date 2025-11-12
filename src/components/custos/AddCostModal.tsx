import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, parseLocalDate } from "@/lib/utils";
import { CustoFormData, TipoCusto } from "@/types/custo";

interface AddCostModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (custo: Omit<CustoFormData, "eventoId">) => void;
  eventoMotivo: string;
}

const tipoCustoOptions: { value: TipoCusto; label: string }[] = [
  { value: "ingredientes", label: "Ingredientes" },
  { value: "carvao", label: "Carvão" },
  { value: "mercado", label: "Mercado" },
  { value: "bebidas", label: "Bebidas" },
  { value: "descartaveis", label: "Descartáveis" },
  { value: "transporte", label: "Transporte" },
  { value: "locacao", label: "Locação de material" },
];

export function AddCostModal({ open, onClose, onSave, eventoMotivo }: AddCostModalProps) {
  const [formData, setFormData] = useState<Omit<CustoFormData, "eventoId">>({
    descricao: "",
    tipo: "ingredientes",
    valor: 0,
    data: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      descricao: "",
      tipo: "ingredientes",
      valor: 0,
      data: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove all non-digit characters
    const numericString = rawValue.replace(/\D/g, "");

    if (numericString === "") {
      setFormData({ ...formData, valor: 0 });
      return;
    }

    // Convert the string of digits to a number, treating it as cents
    const valueAsNumber = Number(numericString) / 100;
    setFormData({ ...formData, valor: valueAsNumber });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Adicionar Gasto - {eventoMotivo}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Gasto</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Carne bovina, Bebidas, Aluguel de mesas..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Gasto</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TipoCusto) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tipoCustoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="text"
              value={
                formData.valor > 0
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(formData.valor)
                  : ""
              }
              onChange={handleValorChange}
              placeholder="R$ 0,00"
              required
              className={cn({ "text-right": formData.valor > 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Data do Gasto</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.data && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data
                    ? format(parseLocalDate(formData.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data ? parseLocalDate(formData.data) : undefined}
                  onSelect={(date) =>
                    setFormData({
                      ...formData,
                      data: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-[hsl(210_11%_55%)] text-white hover:bg-[hsl(210_11%_45%)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90"
            >
              Salvar Gasto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}