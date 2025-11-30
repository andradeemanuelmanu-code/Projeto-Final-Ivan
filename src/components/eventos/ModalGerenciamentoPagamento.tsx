import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Evento, MetodoPagamento, StatusPagamento } from "@/types/evento";

interface ModalGerenciamentoPagamentoProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Evento>) => void;
  evento: Evento | null;
}

type PaymentData = {
  valor: number;
  valorEntrada?: number;
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
};

export const ModalGerenciamentoPagamento = ({ open, onClose, onSave, evento }: ModalGerenciamentoPagamentoProps) => {
  const [formData, setFormData] = useState<PaymentData>({
    valor: 0,
    valorEntrada: 0,
    metodoPagamento: "pix",
    statusPagamento: "pending",
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        valor: evento.valor,
        valorEntrada: evento.valorEntrada || 0,
        metodoPagamento: evento.metodoPagamento,
        statusPagamento: evento.statusPagamento,
      });
    }
  }, [evento, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'valor' | 'valorEntrada') => {
    const rawValue = e.target.value;
    const numericString = rawValue.replace(/\D/g, "");
    const valueAsNumber = numericString ? Number(numericString) / 100 : 0;
    setFormData(prev => ({ ...prev, [field]: valueAsNumber }));
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Pagamento</DialogTitle>
          <DialogDescription>
            Ajuste os detalhes financeiros para o evento: <strong>{evento?.motivo}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="statusPagamento">Status de Pagamento *</Label>
            <Select
              value={formData.statusPagamento}
              onValueChange={(value: StatusPagamento) =>
                setFormData(prev => ({ ...prev, statusPagamento: value }))
              }
            >
              <SelectTrigger id="statusPagamento">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="quote">Orçamento</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total *</Label>
              <Input
                id="valor"
                type="text"
                value={formatCurrency(formData.valor)}
                onChange={(e) => handleValorChange(e, 'valor')}
                placeholder="R$ 0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorEntrada">Valor de Entrada</Label>
              <Input
                id="valorEntrada"
                type="text"
                value={formatCurrency(formData.valorEntrada)}
                onChange={(e) => handleValorChange(e, 'valorEntrada')}
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodoPagamento">Método de Pagamento *</Label>
            <Select
              value={formData.metodoPagamento}
              onValueChange={(value: MetodoPagamento) =>
                setFormData(prev => ({ ...prev, metodoPagamento: value }))
              }
            >
              <SelectTrigger id="metodoPagamento">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
                <SelectItem value="debito">Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};