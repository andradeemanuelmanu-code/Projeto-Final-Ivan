import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvaliacaoTrabalho, AvaliacaoPontualidade } from "@/types/avaliacao";
import { DollarSign } from "lucide-react";

interface ModalMembroAvaliacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membroNome: string;
  eventoId: string;
  membroId: string;
  onSave: (eventoId: string, membroId: string, trabalho: AvaliacaoTrabalho, pontualidade: AvaliacaoPontualidade, valor: number) => void;
  avaliacaoExistente?: {
    trabalho: AvaliacaoTrabalho;
    pontualidade: AvaliacaoPontualidade;
    valorEscala: number;
  };
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
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (open && avaliacaoExistente) {
      setTrabalho(avaliacaoExistente.trabalho);
      setPontualidade(avaliacaoExistente.pontualidade);
      setValor(avaliacaoExistente.valorEscala);
    } else if (open) {
      setTrabalho("bom");
      setPontualidade("no-horario");
      setValor(0);
    }
  }, [open, avaliacaoExistente]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericString = rawValue.replace(/\D/g, "");
    const valueAsNumber = numericString ? Number(numericString) / 100 : 0;
    setValor(valueAsNumber);
  };

  const handleSave = () => {
    onSave(eventoId, membroId, trabalho, pontualidade, valor);
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
          <div className="space-y-2">
            <Label htmlFor="valorEscala">Valor da Escala (R$)</Label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="valorEscala"
                placeholder="0,00"
                value={
                  valor > 0
                    ? new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(valor)
                    : ""
                }
                onChange={handleValorChange}
                className="pl-8"
              />
            </div>
          </div>

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
                <SelectItem value="excelente">Excelente</SelectItem>
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
                <SelectItem value="no-horario">No horário</SelectItem>
                <SelectItem value="adiantado">Adiantado</SelectItem>
              </SelectContent>
            </Select>
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