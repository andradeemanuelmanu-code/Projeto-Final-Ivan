import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Evento, EventoFormData, TipoCardapio, MetodoPagamento, StatusPagamento } from "@/types/evento";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventoFormData) => void;
  evento?: Evento;
}

const cardapioOptions: { value: TipoCardapio; label: string }[] = [
  { value: "churrasco-tradicional", label: "Churrasco Tradicional" },
  { value: "churrasco-prime", label: "Churrasco Prime" },
  { value: "churrasco-vip", label: "Churrasco VIP" },
  { value: "massas", label: "Massas" },
  { value: "roda-boteco", label: "Roda de Boteco" },
  { value: "coffee-break", label: "Coffee Break" },
  { value: "evento-kids", label: "Evento Kids" },
  { value: "jantar", label: "Jantar" },
];

const bebidasOptions = ["Água", "Refrigerante", "Suco", "Cerveja", "Vinho"];

export const EventoModal = ({ open, onClose, onSave, evento }: EventoModalProps) => {
  const [formData, setFormData] = useState<EventoFormData>({
    motivo: "",
    cliente: { nome: "", celular: "", email: "" },
    data: "",
    convidados: 0,
    cardapio: [],
    bebidas: [],
    horario: { inicio: "", termino: "" },
    endereco: "",
    valor: 0,
    metodoPagamento: "pix",
    statusPagamento: "pending",
    observacoes: "",
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        motivo: evento.motivo,
        cliente: evento.cliente,
        data: evento.data,
        convidados: evento.convidados,
        cardapio: evento.cardapio,
        bebidas: evento.bebidas,
        horario: evento.horario,
        endereco: evento.endereco,
        valor: evento.valor,
        metodoPagamento: evento.metodoPagamento,
        statusPagamento: evento.statusPagamento,
        observacoes: evento.observacoes,
      });
    } else {
      setFormData({
        motivo: "",
        cliente: { nome: "", celular: "", email: "" },
        data: "",
        convidados: 0,
        cardapio: [],
        bebidas: [],
        horario: { inicio: "", termino: "" },
        endereco: "",
        valor: 0,
        metodoPagamento: "pix",
        statusPagamento: "pending",
        observacoes: "",
      });
    }
  }, [evento, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleCardapio = (item: TipoCardapio) => {
    setFormData(prev => ({
      ...prev,
      cardapio: prev.cardapio.includes(item)
        ? prev.cardapio.filter(i => i !== item)
        : [...prev.cardapio, item]
    }));
  };

  const toggleBebida = (bebida: string) => {
    setFormData(prev => ({
      ...prev,
      bebidas: prev.bebidas.includes(bebida)
        ? prev.bebidas.filter(b => b !== bebida)
        : [...prev.bebidas, bebida]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl sm:text-2xl">
            {evento ? "Editar Evento" : "Novo Evento"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-2 sm:pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Motivo do Evento */}
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo do Evento *</Label>
              <Input
                id="motivo"
                value={formData.motivo}
                onChange={e => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                placeholder="Ex: Casamento, Aniversário, Formatura..."
                required
              />
            </div>

            {/* Dados do Cliente */}
            <div className="space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm">Dados do Cliente</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clienteNome">Nome *</Label>
                  <Input
                    id="clienteNome"
                    value={formData.cliente.nome}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cliente: { ...prev.cliente, nome: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteCelular">Celular *</Label>
                  <Input
                    id="clienteCelular"
                    value={formData.cliente.celular}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cliente: { ...prev.cliente, celular: e.target.value }
                    }))}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteEmail">E-mail *</Label>
                  <Input
                    id="clienteEmail"
                    type="email"
                    value={formData.cliente.email}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      cliente: { ...prev.cliente, email: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Data e Convidados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data do Evento *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={e => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convidados">Número de Convidados *</Label>
                <Input
                  id="convidados"
                  type="number"
                  min="1"
                  value={formData.convidados || ""}
                  onChange={e => setFormData(prev => ({ ...prev, convidados: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            {/* Cardápio */}
            <div className="space-y-2">
              <Label>Cardápio *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {cardapioOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cardapio-${option.value}`}
                      checked={formData.cardapio.includes(option.value)}
                      onCheckedChange={() => toggleCardapio(option.value)}
                    />
                    <label
                      htmlFor={`cardapio-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bebidas */}
            <div className="space-y-2">
              <Label>Bebidas</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {bebidasOptions.map(bebida => (
                  <div key={bebida} className="flex items-center space-x-2">
                    <Checkbox
                      id={`bebida-${bebida}`}
                      checked={formData.bebidas.includes(bebida)}
                      onCheckedChange={() => toggleBebida(bebida)}
                    />
                    <label
                      htmlFor={`bebida-${bebida}`}
                      className="text-sm cursor-pointer"
                    >
                      {bebida}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Horário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioInicio">Horário de Início *</Label>
                <Input
                  id="horarioInicio"
                  type="time"
                  value={formData.horario.inicio}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    horario: { ...prev.horario, inicio: e.target.value }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioTermino">Horário de Término *</Label>
                <Input
                  id="horarioTermino"
                  type="time"
                  value={formData.horario.termino}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    horario: { ...prev.horario, termino: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço do Evento *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={e => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </div>

            {/* Valor e Pagamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Total *</Label>
                <Input
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor || ""}
                  onChange={e => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  required
                />
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
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Informações adicionais sobre o evento..."
                rows={3}
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                {evento ? "Salvar Alterações" : "Criar Evento"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
