import { useState, useEffect } from "react";
import { MembroEquipe, MembroEquipeFormData, FuncaoEquipe } from "@/types/equipe";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalMembroProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membro: MembroEquipe | null;
  onSave: (data: MembroEquipeFormData) => void;
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

export const ModalMembro = ({ open, onOpenChange, membro, onSave }: ModalMembroProps) => {
  const [formData, setFormData] = useState<MembroEquipeFormData>({
    nome: "",
    funcaoPrincipal: "garcom",
    funcoesSecundarias: [],
    telefone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (membro) {
      setFormData({
        nome: membro.nome,
        funcaoPrincipal: membro.funcaoPrincipal,
        funcoesSecundarias: membro.funcoesSecundarias || [],
        telefone: membro.telefone,
        email: membro.email,
      });
    } else {
      setFormData({
        nome: "",
        funcaoPrincipal: "garcom",
        funcoesSecundarias: [],
        telefone: "",
        email: "",
      });
    }
    setErrors({});
  }, [membro, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = "Formato inválido. Use (00) 00000-0000";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
    onOpenChange(false);
  };

  const handleFuncaoSecundariaChange = (funcao: FuncaoEquipe) => {
    setFormData(prev => {
      const funcoesAtuais = prev.funcoesSecundarias || [];
      if (funcoesAtuais.includes(funcao)) {
        return { ...prev, funcoesSecundarias: funcoesAtuais.filter(f => f !== funcao) };
      } else {
        return { ...prev, funcoesSecundarias: [...funcoesAtuais, funcao] };
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {membro ? "Editar Membro" : "Adicionar Membro"}
          </DialogTitle>
          <DialogDescription>
            {membro ? "Atualize as informações do membro da equipe." : "Cadastre um novo membro da equipe."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6">
          <div className="space-y-4 py-4 px-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
            </div>

            {/* Função Principal */}
            <div className="space-y-2">
              <Label htmlFor="funcaoPrincipal">Função Principal *</Label>
              <Select
                value={formData.funcaoPrincipal}
                onValueChange={(value) => setFormData({ ...formData, funcaoPrincipal: value as FuncaoEquipe })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {FUNCOES.map(funcao => (
                    <SelectItem key={funcao.value} value={funcao.value}>
                      {funcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Funções Secundárias */}
            <div className="space-y-2">
              <Label>Funções Secundárias</Label>
              <div className="space-y-2 rounded-md border p-4">
                {FUNCOES.map(funcao => (
                  <div key={funcao.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`funcao-sec-${funcao.value}`}
                      checked={formData.funcoesSecundarias.includes(funcao.value)}
                      disabled={formData.funcaoPrincipal === funcao.value}
                      onCheckedChange={() => handleFuncaoSecundariaChange(funcao.value)}
                    />
                    <Label
                      htmlFor={`funcao-sec-${funcao.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {funcao.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
              {errors.telefone && <p className="text-sm text-destructive">{errors.telefone}</p>}
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#C44536] hover:bg-[#C44536]/90"
          >
            {membro ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};