import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AddFixedCostModal } from "@/components/custos-fixos/AddFixedCostModal";
import { TabelaCustosFixos } from "@/components/custos-fixos/TabelaCustosFixos";
import { MonthSelector } from "@/components/custos-fixos/MonthSelector";
import { HistoricoMeses } from "@/components/custos-fixos/HistoricoMeses";
import { custosFixosStorage } from "@/lib/custosFixosStorage";
import { eventosStorage } from "@/lib/eventosStorage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustosFixosMensais = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [custoToDelete, setCustoToDelete] = useState<string | null>(null);

  // Mês atual como padrão
  const mesAtual = new Date();
  const mesReferenciaInicial = `${mesAtual.getFullYear()}-${String(
    mesAtual.getMonth() + 1,
  ).padStart(2, "0")}`;

  const [mesReferencia, setMesReferencia] = useState(mesReferenciaInicial);
  const [custos, setCustos] = useState(custosFixosStorage.getByMes(mesReferencia));
  const [eventos, setEventos] = useState(eventosStorage.getAll());
  const [historico, setHistorico] = useState(custosFixosStorage.getHistoricoMeses(3));

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCustos(custosFixosStorage.getByMes(mesReferencia));
      setEventos(eventosStorage.getAll());
      setHistorico(custosFixosStorage.getHistoricoMeses(3));
      setLoading(false);
    }, 300);
  }, [mesReferencia]);

  const handleSave = (data: {
    descricao: string;
    tipo: any;
    valor: number;
    eventoId?: string;
  }) => {
    custosFixosStorage.create({
      ...data,
      mesReferencia,
    });

    setCustos(custosFixosStorage.getByMes(mesReferencia));
    setHistorico(custosFixosStorage.getHistoricoMeses(3));

    toast({
      title: "Custo adicionado com sucesso",
      description: "O custo fixo foi registrado.",
    });
  };

  const handleDelete = (id: string) => {
    setCustoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (custoToDelete) {
      custosFixosStorage.delete(custoToDelete);
      setCustos(custosFixosStorage.getByMes(mesReferencia));
      setHistorico(custosFixosStorage.getHistoricoMeses(3));

      toast({
        title: "Custo excluído",
        description: "O custo fixo foi removido com sucesso.",
      });
    }
    setDeleteDialogOpen(false);
    setCustoToDelete(null);
  };

  const totalMes = custosFixosStorage.getTotalByMes(mesReferencia);

  return (
    <DashboardLayout
      title="Custos Fixos Mensais"
      description="Gerencie os gastos mensais e acompanhe o histórico"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
          <Button onClick={() => setModalOpen(true)} className="bg-accent hover:bg-accent/90">
            <Plus size={20} />
            Adicionar Gasto
          </Button>
        </div>

        {/* Seletor de Mês */}
        <div className="bg-card border border-border rounded-lg p-4">
          <MonthSelector value={mesReferencia} onChange={setMesReferencia} />
        </div>

        {/* Tabela de Custos */}
        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : (
          <>
            <TabelaCustosFixos
              custos={custos}
              eventos={eventos}
              onDelete={handleDelete}
            />
            {custos.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-foreground">
                    Total do Mês
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {totalMes.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Histórico */}
        <HistoricoMeses historico={historico} />

        {/* Modal de Adição */}
        <AddFixedCostModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleSave}
          mesReferencia={mesReferencia}
          eventos={eventos}
        />

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este custo fixo? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default CustosFixosMensais;