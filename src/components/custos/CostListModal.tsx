"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Evento } from "@/types/evento";
import { Custo, CustoFormData, TipoCusto } from "@/types/custo";
import { CostItem } from "./CostItem";
import { Receipt, CalendarIcon, PlusCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, parseLocalDate } from "@/lib/utils";

interface CostListModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (custo: Omit<CustoFormData, "eventoId">) => void;
  evento: Evento | null;
  custos: Custo[];
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

export function CostListModal({ open, onClose, onSave, evento, custos }: CostListModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<CustoFormData, "eventoId">>({
    descricao: "",
    tipo: "ingredientes",
    valor: 0,
    data: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  if (!evento) return null;

  const totalGastos = custos.reduce((acc, custo) => acc + custo.valor, 0);

  const resetForm = () => {
    setFormData({
      descricao: "",
      tipo: "ingredientes",
      valor: 0,
      data: new Date().toISOString().split("T")[0],
    });
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.descricao && formData.valor > 0) {
      onSave(formData);
      resetForm();
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericString = rawValue.replace(/\D/g, "");
    if (numericString === "") {
      setFormData({ ...formData, valor: 0 });
      return;
    }
    const valueAsNumber = Number(numericString) / 100;
    setFormData({ ...formData, valor: valueAsNumber });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Gastos do Evento: {evento.motivo}
          </DialogTitle>
          <DialogDescription>
            Visualize e adicione os gastos associados a este evento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 gap-4">
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {custos.length > 0 ? (
                  custos.map(custo => <CostItem key={custo.id} custo={custo} />)
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center h-full">
                    <Receipt className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Nenhum Gasto Registrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Adicione o primeiro gasto abaixo.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {custos.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-muted p-4 flex-shrink-0">
              <span className="font-semibold text-muted-foreground">Total de Gastos</span>
              <span className="font-bold text-xl text-foreground">
                {totalGastos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          )}

          <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen} className="flex-shrink-0">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Adicionar Novo Gasto</span>
                <PlusCircle className={cn("h-5 w-5 transition-transform", isFormOpen && "rotate-45")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Gasto</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: Carne bovina, Bebidas..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        {tipoCustoOptions.map(option => (
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
                    />
                  </div>
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
                        onSelect={date =>
                          setFormData({
                            ...formData,
                            data: date ? date.toISOString().split("T")[0] : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-3 pt-2 justify-end">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Gasto</Button>
                </div>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter className="pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}