import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotaFiscalFormData } from "@/types/notaFiscal";
import { Evento } from "@/types/evento";
import { parseLocalDate } from "@/lib/utils";

interface ModalRegistrarNotaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventos: Evento[];
  onSave: (data: NotaFiscalFormData) => void;
}

export function ModalRegistrarNota({ open, onOpenChange, eventos, onSave }: ModalRegistrarNotaProps) {
  const [eventoId, setEventoId] = useState("");
  const [emitirNota, setEmitirNota] = useState(true);
  const [tipoNota, setTipoNota] = useState<"nfe" | "rps" | "outro">("nfe");
  const [valorTributavel, setValorTributavel] = useState("");
  const [tipoImposto, setTipoImposto] = useState<"iss" | "simples-nacional" | "outro">("iss");
  const [percentualImposto, setPercentualImposto] = useState("5");
  const [situacaoImposto, setSituacaoImposto] = useState<"pago" | "pendente">("pendente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valor = parseFloat(valorTributavel);
    const percentual = parseFloat(percentualImposto);
    const valorImposto = (valor * percentual) / 100;

    const formData: NotaFiscalFormData = {
      eventoId,
      emitirNota,
      tipoNota,
      valorTributavel: valor,
      tipoImposto,
      valorImposto,
      situacaoNota: emitirNota ? "emitida" : "nao-emitida",
      situacaoImposto,
    };

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setEventoId("");
    setEmitirNota(true);
    setTipoNota("nfe");
    setValorTributavel("");
    setTipoImposto("iss");
    setPercentualImposto("5");
    setSituacaoImposto("pendente");
    onOpenChange(false);
  };

  const valorImposto = valorTributavel ? (parseFloat(valorTributavel) * parseFloat(percentualImposto)) / 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nota Fiscal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="evento">Evento Associado *</Label>
            <Select value={eventoId} onValueChange={setEventoId} required>
              <SelectTrigger id="evento">
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map((evento) => (
                  <SelectItem key={evento.id} value={evento.id}>
                    {evento.motivo} - {evento.cliente.nome} ({parseLocalDate(evento.data).toLocaleDateString("pt-BR")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Emitir Nota Fiscal *</Label>
            <RadioGroup value={emitirNota ? "sim" : "nao"} onValueChange={(v) => setEmitirNota(v === "sim")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="font-normal cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao" className="font-normal cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {emitirNota && (
            <div className="space-y-2">
              <Label htmlFor="tipoNota">Tipo de Nota *</Label>
              <Select value={tipoNota} onValueChange={(v: any) => setTipoNota(v)}>
                <SelectTrigger id="tipoNota">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfe">NF-e</SelectItem>
                  <SelectItem value="rps">RPS</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="valorTributavel">Valor Tributável (R$) *</Label>
            <Input
              id="valorTributavel"
              type="number"
              step="0.01"
              value={valorTributavel}
              onChange={(e) => setValorTributavel(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoImposto">Tipo de Imposto *</Label>
              <Select value={tipoImposto} onValueChange={(v: any) => setTipoImposto(v)}>
                <SelectTrigger id="tipoImposto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iss">ISS</SelectItem>
                  <SelectItem value="simples-nacional">Simples Nacional</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentualImposto">Percentual (%) *</Label>
              <Input
                id="percentualImposto"
                type="number"
                step="0.01"
                value={percentualImposto}
                onChange={(e) => setPercentualImposto(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Valor do Imposto Calculado:</p>
            <p className="text-2xl font-bold text-accent">
              {valorImposto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Situação do Imposto *</Label>
            <RadioGroup value={situacaoImposto} onValueChange={(v: any) => setSituacaoImposto(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pago" id="pago" />
                <Label htmlFor="pago" className="font-normal cursor-pointer">Pago</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pendente" id="pendente" />
                <Label htmlFor="pendente" className="font-normal cursor-pointer">Pendente</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Nota Fiscal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
