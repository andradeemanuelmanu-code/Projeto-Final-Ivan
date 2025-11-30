import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FuncaoEquipe } from "@/types/equipe";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioNome: string;
  onAprovar: (funcaoPrincipal: FuncaoEquipe, funcoesSecundarias: FuncaoEquipe[]) => void;
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
  const [funcaoPrincipal, setFuncaoPrincipal] = useState<FuncaoEquipe>("garcom");
  const [funcoesSecundarias, setFuncoesSecundarias] = useState<FuncaoEquipe[]>([]);

  useEffect(() => {
    if (!open) {
      setFuncaoPrincipal("garcom");
      setFuncoesSecundarias([]);
    }
  }, [open]);

  const handleAprovar = () => {
    onAprovar(funcaoPrincipal, funcoesSecundarias);
    onOpenChange(false);
  };

  const handleFuncaoSecundariaChange = (funcao: FuncaoEquipe) => {
    setFuncoesSecundarias(prev => {
      if (prev.includes(funcao)) {
        return prev.filter(f => f !== funcao);
      } else {
        return [...prev, funcao];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar Membro</DialogTitle>
          <DialogDescription>
            Defina as funções para <strong>{usuarioNome}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="funcao">Função Principal</Label>
            <Select
              value={funcaoPrincipal}
              onValueChange={(value) => {
                const newFuncao = value as FuncaoEquipe;
                setFuncaoPrincipal(newFuncao);
                if (funcoesSecundarias.includes(newFuncao)) {
                  setFuncoesSecundarias(fs => fs.filter(f => f !== newFuncao));
                }
              }}
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

          <div className="space-y-2">
            <Label>Funções Secundárias</Label>
            <div className="space-y-2 rounded-md border p-4">
              {funcoesDisponiveis.map(funcao => (
                <div key={funcao.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`funcao-sec-aprov-${funcao.value}`}
                    checked={funcoesSecundarias.includes(funcao.value)}
                    disabled={funcaoPrincipal === funcao.value}
                    onCheckedChange={() => handleFuncaoSecundariaChange(funcao.value)}
                  />
                  <Label
                    htmlFor={`funcao-sec-aprov-${funcao.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {funcao.label}
                  </Label>
                </div>
              ))}
            </div>
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