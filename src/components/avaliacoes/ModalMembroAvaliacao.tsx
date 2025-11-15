import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avaliacao, AvaliacaoTrabalho, AvaliacaoPontualidade, AvaliacaoFormData } from "@/types/avaliacao";
import { DollarSign, Award, Equal } from "lucide-react";

interface ModalMembroAvaliacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membroNome: string;
  eventoId: string;
  membroId: string;
  onSave: (data: AvaliacaoFormData) => void;
  avaliacaoExistente?: Avaliacao;
}

export const ModalMembroAvaliacao = ({
  open,
  onOpenChange,
  membroNome,
  eventoId,
  membroId,
  onSave,
  avaliacaoExistente,
}: ModalMembroAvaliacaoProps) => {
  const [trabalho, setTrabalho] = useState<AvaliacaoTrabalho>("bom");
  const [pontualidade, setPontualidade] = useState<AvaliacaoPontualidade>("no-horario");
  const [valorBase, setValorBase] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    if (open && avaliacaoExistente) {
      setTrabalho(avaliacaoExistente.avaliacaoTrabalho);
      setPontualidade(avaliacaoExistente.pontualidade);
      setValorBase(avaliacaoExistente.valorBase || 0);
    } else if (open) {
      // Reseta para uma nova avaliação
      setTrabalho("bom");
      setPontualidade("no-horario");
      setValorBase(0);
    }
  }, [open, avaliacaoExistente]);

  useEffect(() => {
    let bonusCalculado = 0;
    if (trabalho === "excelente") {
      bonusCalculado += 30;
    }
    if (pontualidade === "no-horario" || pontualidade === "adiantado") {
      bonusCalculado += 30;
    }
    setBonus(bonusCalculado);
    setValorTotal(valorBase + bonusCalculado);
  }, [valorBase, trabalho, pontualidade]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericString = rawValue.replace(/\D/g, "");
    const valueAsNumber = numericString ? Number(numericString) / 100 : 0;
    setValorBase(valueAsNumber);
  };

  const handleSave = () => {
    onSave({
      eventoId,
      membroId,
      avaliacaoTrabalho: trabalho,
      pontualidade,
      valorBase: valorBase,
      valorBonus: bonus,
      valorEscala: valorTotal,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Avaliar Membro – {membroNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Valor Base */}
          <div className="space-y-2">
            <Label htmlFor="valorBase">Valor Base da Escala (R$)</Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="valorBase"
                placeholder="0,00"
                value={
                  valorBase > 0
                    ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(valorBase)
                    : ""
                }
                onChange={handleValorChange}
                className="pl-8"
              />
            </div>
          </div>

          {/* Avaliações */}
          <div className="space-y-2">
            <Label htmlFor="trabalho">Avaliação do Trabalho</Label>
            <Select value={trabalho} onValueChange={(value) => setTrabalho(value as AvaliacaoTrabalho)}>
              <SelectTrigger id="trabalho">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ruim">Ruim</SelectItem>
                <SelectItem value="razoavel">Razoável</SelectItem>
                <SelectItem value="bom">Bom</SelectItem>
                <SelectItem value="excelente">Excelente (+ R$ 30,00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pontualidade">Pontualidade</Label>
            <Select value={pontualidade} onValueChange={(value) => setPontualidade(value as AvaliacaoPontualidade)}>
              <SelectTrigger id="pontualidade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="no-horario">No horário (+ R$ 30,00)</SelectItem>
                <SelectItem value="adiantado">Adiantado (+ R$ 30,00)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resumo Financeiro */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award size={16} />
                <span>Bônus por Desempenho</span>
              </div>
              <span className="font-medium text-primary">
                {bonus.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Equal size={18} />
                <span>Valor Total a Pagar</span>
              </div>
              <span className="text-primary">
                {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#C44536] hover:bg-[#C44536]/90">
            Salvar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};