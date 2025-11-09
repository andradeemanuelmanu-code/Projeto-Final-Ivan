import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoCustoFixo } from "@/types/custoFixo";
import { Evento } from "@/types/evento";

interface AddFixedCostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    descricao: string;
    tipo: TipoCustoFixo;
    valor: number;
    eventoId?: string;
  }) => void;
  mesReferencia: string;
  eventos: Evento[];
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
  mesReferencia,
  eventos,
}: AddFixedCostModalProps) => {
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoCustoFixo>("internet");
  const [valor, setValor] = useState("");
  const [eventoId, setEventoId] = useState<string>("");

  const handleSave = () => {
    if (!descricao || !valor) return;

    onSave({
      descricao,
      tipo,
      valor: parseFloat(valor.replace(/[^\d,]/g, "").replace(",", ".")),
      eventoId: eventoId || undefined,
    });

    // Reset form
    setDescricao("");
    setTipo("internet");
    setValor("");
    setEventoId("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setDescricao("");
    setTipo("internet");
    setValor("");
    setEventoId("");
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

  // Filtrar eventos do mês atual
  const eventosDoMes = eventos.filter(evento => {
    const eventoData = new Date(evento.data);
    const [ano, mes] = mesReferencia.split("-");
    return (
      eventoData.getFullYear() === parseInt(ano) &&
      eventoData.getMonth() + 1 === parseInt(mes)
    );
  });

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
            <Label htmlFor="evento">Associar a Evento (opcional)</Label>
            {eventosDoMes.length > 0 ? (
              <Select value={eventoId} onValueChange={setEventoId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="none">Nenhum evento</SelectItem>
                  {eventosDoMes.map((evento) => (
                    <SelectItem key={evento.id} value={evento.id}>
                      {evento.motivo} - {new Date(evento.data).toLocaleDateString("pt-BR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Nenhum evento registrado neste mês. Cadastre um evento antes de associar custos
                fixos.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!descricao || !valor}
            className="bg-accent hover:bg-accent/90"
          >
            Salvar Gasto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
