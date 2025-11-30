import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NotaFiscalCard } from "@/components/fiscal/NotaFiscalCard";
import { ModalRegistrarNota } from "@/components/fiscal/ModalRegistrarNota";
import { ResumoFiscal } from "@/components/fiscal/ResumoFiscal";
import { notasFiscaisStorage } from "@/lib/notasFiscaisStorage";
import { eventosStorage } from "@/lib/eventosStorage";
import { NotaFiscal, NotaFiscalFormData, SituacaoImposto } from "@/types/notaFiscal";
import { Evento } from "@/types/evento";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function GestaoFiscal() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setIsLoading(true);
    setTimeout(() => {
      const notasCarregadas = notasFiscaisStorage.getAll();
      const eventosCarregados = eventosStorage.getAllSorted();
      setNotas(notasCarregadas);
      setEventos(eventosCarregados);
      setIsLoading(false);
    }, 500);
  };

  const handleSalvarNota = (data: NotaFiscalFormData) => {
    notasFiscaisStorage.create(data);
    carregarDados();
    toast({
      title: "Nota registrada com sucesso",
      description: "A nota fiscal foi registrada no sistema.",
    });
  };

  const handleToggleStatus = (nota: NotaFiscal) => {
    const novoStatus: SituacaoImposto = nota.situacaoImposto === "pago" ? "pendente" : "pago";
    notasFiscaisStorage.updateSituacaoImposto(nota.id, novoStatus);
    carregarDados();
    toast({
      title: "Situação atualizada",
      description: `O status do imposto foi alterado para ${novoStatus === 'pago' ? 'Pago' : 'Pendente'}.`,
    });
  };

  const getEventoById = (eventoId: string): Evento | undefined => {
    return eventos.find(e => e.id === eventoId);
  };

  const resumo = notasFiscaisStorage.getResumo();

  const eventosDisponiveis = eventos.filter(evento => {
    const jaTemNota = notas.some(nota => nota.eventoId === evento.id);
    return !jaTemNota;
  });

  return (
    <DashboardLayout
      title="Gestão Fiscal"
      description="Controle de notas fiscais e impostos por evento"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Nota Fiscal
          </Button>
        </div>

        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </>
        ) : (
          <>
            <ResumoFiscal
              totalEmitidas={resumo.totalEmitidas}
              totalImpostosPagos={resumo.totalImpostosPagos}
              totalImpostosPendentes={resumo.totalImpostosPendentes}
              percentualMedio={resumo.percentualMedio}
            />

            {notas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma nota fiscal registrada. Clique em 'Registrar Nota Fiscal' para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notas.map((nota) => {
                  const evento = getEventoById(nota.eventoId);
                  return evento ? (
                    <NotaFiscalCard key={nota.id} nota={nota} evento={evento} onToggleStatus={handleToggleStatus} />
                  ) : null;
                })}
              </div>
            )}
          </>
        )}
      </div>

      <ModalRegistrarNota
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        eventos={eventosDisponiveis}
        onSave={handleSalvarNota}
      />
    </DashboardLayout>
  );
}