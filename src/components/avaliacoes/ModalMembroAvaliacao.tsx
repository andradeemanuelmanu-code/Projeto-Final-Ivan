import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvaliacaoTrabalho, AvaliacaoPontualidade } from "@/types/avaliacao";

interface ModalMembroAvaliacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membroNome: string;
  eventoId: string;
  membroId: string;
  onSave: (eventoId: string, membroId: string, trabalho: AvaliacaoTrabalho, pontualidade: AvaliacaoPontualidade) => void;
  avaliacaoExistente?: {
    trabalho: AvaliacaoTrabalho;
    pontualidade: AvaliacaoPontualidade;
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
  const [trabalho, setTrabalho] = useState<AvaliacaoTrabalho>(avaliacaoExistente?.trabalho || "bom");
  const [pontualidade, setPontualidade] = useState<AvaliacaoPontualidade>(avaliacaoExistente?.pontualidade || "no-horario");

  const handleSave = () => {
    onSave(eventoId, membroId, trabalho, pontualidade);
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
          {/* Avaliação do Trabalho */}
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

          {/* Pontualidade */}
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
