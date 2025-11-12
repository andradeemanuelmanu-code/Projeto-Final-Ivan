import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuncaoEquipe } from "@/types/equipe";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioNome: string;
  onAprovar: (funcao: FuncaoEquipe) => void;
}

const funcoesDisponiveis: { value: FuncaoEquipe; label: string }[] = [
  { value: "cozinheira", label: "Cozinheira" },
  { value: "ajudante-cozinheira", label: "Ajudante de Cozinheira" },
  { value: "churrasqueiro", label: "Churrasqueiro" },
  { value: "ajudante-churrasqueiro", label: "Ajudante de Churrasqueiro" },
  { value: "garcom", label: "Garçom" },
  { value: "barman", label: "Barman" },
  { value: "maitre", label: "Maître" },
];

export const ApprovalModal = ({ open, onOpenChange, usuarioNome, onAprovar }: ApprovalModalProps) => {
  const [funcaoSelecionada, setFuncaoSelecionada] = useState<FuncaoEquipe>("garcom");

  const handleAprovar = () => {
    onAprovar(funcaoSelecionada);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar Membro</DialogTitle>
          <DialogDescription>
            Selecione a função para <strong>{usuarioNome}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="funcao">Função na Equipe</Label>
            <Select
              value={funcaoSelecionada}
              onValueChange={(value) => setFuncaoSelecionada(value as FuncaoEquipe)}
            >
              <SelectTrigger id="funcao">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {funcoesDisponiveis.map((funcao) => (
                  <SelectItem key={funcao.value} value={funcao.value}>
                    {funcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAprovar}>
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};