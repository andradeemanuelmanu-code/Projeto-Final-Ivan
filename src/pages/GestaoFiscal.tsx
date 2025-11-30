import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";
import { NotaFiscalCard } from "@/components/fiscal/NotaFiscalCard";
import { ModalRegistrarNota } from "@/components/fiscal/ModalRegistrarNota";
import { ModalEditarSituacao } from "@/components/fiscal/ModalEditarSituacao";
import { ResumoFiscal } from "@/components/fiscal/ResumoFiscal";
import { notasFiscaisStorage } from "@/lib/notasFiscaisStorage";
import { eventosStorage } from "@/lib/eventosStorage";
import { NotaFiscal, NotaFiscalFormData, SituacaoImposto } from "@/types/notaFiscal";
import { Evento } from "@/types/evento";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GestaoFiscal() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notaParaEditar, setNotaParaEditar] = useState<NotaFiscal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");
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

  const handleEditStatus = (nota: NotaFiscal) => {
    setNotaParaEditar(nota);
    setIsEditModalOpen(true);
  };

  const handleSalvarStatus = (id: string, situacao: SituacaoImposto) => {
    notasFiscaisStorage.updateSituacaoImposto(id, situacao);
    carregarDados();
    setIsEditModalOpen(false);
    setNotaParaEditar(null);
    toast({
      title: "Situação atualizada",
      description: "O status do imposto foi alterado com sucesso.",
    });
  };

  const getEventoById = (eventoId: string): Evento | undefined => {
    return eventos.find(e => e.id === eventoId);
  };

  const notasFiltradas = notas.filter(nota => {
    if (filtro === "todos") return true;
    if (filtro === "emitidas") return nota.situacaoNota === "emitida";
    if (filtro === "pendentes") return nota.situacaoNota === "nao-emitida" || nota.situacaoImposto === "pendente";
    if (filtro === "sem-nota") return nota.situacaoNota === "nao-emitida";
    return true;
  });

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

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filtro} onValueChange={setFiltro}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="emitidas">Notas Emitidas</SelectItem>
                    <SelectItem value="pendentes">Pendentes</SelectItem>
                    <SelectItem value="sem-nota">Sem Nota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>

            {notasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {filtro === "todos" 
                    ? "Nenhuma nota fiscal registrada. Clique em 'Registrar Nota Fiscal' para começar."
                    : "Nenhuma nota fiscal encontrada com os filtros selecionados."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notasFiltradas.map((nota) => {
                  const evento = getEventoById(nota.eventoId);
                  return evento ? (
                    <NotaFiscalCard key={nota.id} nota={nota} evento={evento} onEditStatus={handleEditStatus} />
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

      <ModalEditarSituacao
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        nota={notaParaEditar}
        evento={notaParaEditar ? getEventoById(notaParaEditar.eventoId) : undefined}
        onSave={handleSalvarStatus}
      />
    </DashboardLayout>
  );
}