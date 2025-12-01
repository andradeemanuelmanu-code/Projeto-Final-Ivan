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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuncaoEquipe } from "@/types/equipe";

interface ModalAdicionarExtraProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (nome: string, funcao: FuncaoEquipe) => void;
}

const FUNCOES: { value: FuncaoEquipe; label: string }[] = [
  { value: "cozinheira", label: "Cozinheira" },
  { value: "ajudante-cozinheira", label: "Ajudante de Cozinheira" },
  { value: "churrasqueiro", label: "Churrasqueiro" },
  { value: "ajudante-churrasqueiro", label: "Ajudante de Churrasqueiro" },
  { value: "garcom", label: "Garçom" },
  { value: "barman", label: "Barman" },
  { value: "maitre", label: "Maître" },
];

export const ModalAdicionarExtra = ({ open, onOpenChange, onSave }: ModalAdicionarExtraProps) => {
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState<FuncaoEquipe>("garcom");

  const handleSave = () => {
    if (!nome.trim()) return;
    onSave(nome, funcao);
    setNome("");
    setFuncao("garcom");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Membro Extra</DialogTitle>
          <DialogDescription>
            Insira os dados do freelancer que não está cadastrado na equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome-extra">Nome Completo *</Label>
            <Input
              id="nome-extra"
              placeholder="Ex: Carlos Andrade"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="funcao-extra">Função *</Label>
            <Select value={funcao} onValueChange={(value) => setFuncao(value as FuncaoEquipe)}>
              <SelectTrigger id="funcao-extra">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FUNCOES.map(f => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};