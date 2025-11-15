import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { opcoesStorage } from "@/lib/opcoesStorage";
import { Opcao } from "@/types/opcoes";
import { useToast } from "@/hooks/use-toast";

interface GerenciarOpcoesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GerenciarOpcoesModal = ({ open, onOpenChange }: GerenciarOpcoesModalProps) => {
  const { toast } = useToast();
  const [cardapioOptions, setCardapioOptions] = useState<Opcao[]>([]);
  const [bebidasOptions, setBebidasOptions] = useState<Opcao[]>([]);
  const [newCardapioLabel, setNewCardapioLabel] = useState("");
  const [newBebidaLabel, setNewBebidaLabel] = useState("");

  useEffect(() => {
    if (open) {
      loadOptions();
    }
  }, [open]);

  const loadOptions = () => {
    setCardapioOptions(opcoesStorage.getCardapioOptions());
    setBebidasOptions(opcoesStorage.getBebidasOptions());
  };

  const handleAddCardapio = () => {
    if (!newCardapioLabel.trim()) return;
    opcoesStorage.addCardapioOption(newCardapioLabel);
    setNewCardapioLabel("");
    loadOptions();
    toast({ title: "Categoria de cardápio adicionada!" });
  };

  const handleDeleteCardapio = (value: string) => {
    opcoesStorage.deleteCardapioOption(value);
    loadOptions();
    toast({ title: "Categoria de cardápio removida.", variant: "destructive" });
  };

  const handleAddBebida = () => {
    if (!newBebidaLabel.trim()) return;
    opcoesStorage.addBebidaOption(newBebidaLabel);
    setNewBebidaLabel("");
    loadOptions();
    toast({ title: "Opção de bebida adicionada!" });
  };

  const handleDeleteBebida = (value: string) => {
    opcoesStorage.deleteBebidaOption(value);
    loadOptions();
    toast({ title: "Opção de bebida removida.", variant: "destructive" });
  };

  const renderOptionsList = (
    options: Opcao[],
    onDelete: (value: string) => void
  ) => (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {options.map(option => (
        <div key={option.value} className="flex items-center justify-between p-2 border rounded-md">
          <span className="text-sm">{option.label}</span>
          <Button variant="ghost" size="icon" onClick={() => onDelete(option.value)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Opções</DialogTitle>
          <DialogDescription>
            Adicione ou remova categorias de cardápio e opções de bebidas.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="cardapio" className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cardapio">Cardápio</TabsTrigger>
            <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
          </TabsList>
          <TabsContent value="cardapio" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-cardapio">Nova Categoria de Cardápio</Label>
              <div className="flex gap-2">
                <Input
                  id="new-cardapio"
                  value={newCardapioLabel}
                  onChange={e => setNewCardapioLabel(e.target.value)}
                  placeholder="Ex: Comida Japonesa"
                />
                <Button onClick={handleAddCardapio}><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
              </div>
            </div>
            {renderOptionsList(cardapioOptions, handleDeleteCardapio)}
          </TabsContent>
          <TabsContent value="bebidas" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-bebida">Nova Opção de Bebida</Label>
              <div className="flex gap-2">
                <Input
                  id="new-bebida"
                  value={newBebidaLabel}
                  onChange={e => setNewBebidaLabel(e.target.value)}
                  placeholder="Ex: Drinks Especiais"
                />
                <Button onClick={handleAddBebida}><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
              </div>
            </div>
            {renderOptionsList(bebidasOptions, handleDeleteBebida)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};