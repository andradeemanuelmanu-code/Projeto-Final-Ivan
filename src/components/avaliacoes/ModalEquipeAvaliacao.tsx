import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { MembroEquipe } from "@/types/equipe";
import { avaliacoesStorage } from "@/lib/avaliacoesStorage";
import { ModalMembroAvaliacao } from "./ModalMembroAvaliacao";
import { AvaliacaoTrabalho, AvaliacaoPontualidade } from "@/types/avaliacao";

interface ModalEquipeAvaliacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventoNome: string;
  eventoId: string;
  membros: MembroEquipe[];
  onAvaliacaoSaved: () => void;
}

const FUNCAO_LABELS: Record<string, string> = {
  cozinheira: "Cozinheira",
  "ajudante-cozinheira": "Ajudante de Cozinheira",
  churrasqueiro: "Churrasqueiro",
  "ajudante-churrasqueiro": "Ajudante de Churrasqueiro",
  garcom: "Garçom",
  barman: "Barman",
  maitre: "Maître",
};

export const ModalEquipeAvaliacao = ({
  open,
  onOpenChange,
  eventoNome,
  eventoId,
  membros,
  onAvaliacaoSaved,
}: ModalEquipeAvaliacaoProps) => {
  const [membroSelecionado, setMembroSelecionado] = useState<MembroEquipe | null>(null);
  const [modalMembroOpen, setModalMembroOpen] = useState(false);

  const handleMembroClick = (membro: MembroEquipe) => {
    setMembroSelecionado(membro);
    setModalMembroOpen(true);
  };

  const handleSaveAvaliacao = (
    eventoId: string,
    membroId: string,
    trabalho: AvaliacaoTrabalho,
    pontualidade: AvaliacaoPontualidade,
    valorEscala: number
  ) => {
    avaliacoesStorage.create({
      eventoId,
      membroId,
      avaliacaoTrabalho: trabalho,
      pontualidade,
      valorEscala,
    });
    onAvaliacaoSaved();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Avaliar Equipe – {eventoNome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {membros.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum membro escalado para este evento.
              </p>
            ) : (
              membros.map((membro) => {
                const isAvaliado = avaliacoesStorage.isMembroAvaliado(membro.id, eventoId);
                return (
                  <Button
                    key={membro.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4 hover:bg-accent"
                    onClick={() => handleMembroClick(membro)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium text-base">{membro.nome}</span>
                        <span className="text-sm text-muted-foreground">
                          {FUNCAO_LABELS[membro.funcao] || membro.funcao}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAvaliado ? (
                          <div className="flex items-center gap-1 text-[#5CB85C]">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-medium">Avaliado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[#F0AD4E]">
                            <Clock size={20} />
                            <span className="text-sm font-medium">Pendente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {membroSelecionado && (
        <ModalMembroAvaliacao
          open={modalMembroOpen}
          onOpenChange={setModalMembroOpen}
          membroNome={membroSelecionado.nome}
          eventoId={eventoId}
          membroId={membroSelecionado.id}
          onSave={handleSaveAvaliacao}
          avaliacaoExistente={
            avaliacoesStorage.getByMembroAndEvento(membroSelecionado.id, eventoId)
              ? {
                  trabalho: avaliacoesStorage.getByMembroAndEvento(membroSelecionado.id, eventoId)!.avaliacaoTrabalho,
                  pontualidade: avaliacoesStorage.getByMembroAndEvento(membroSelecionado.id, eventoId)!.pontualidade,
                  valorEscala: avaliacoesStorage.getByMembroAndEvento(membroSelecionado.id, eventoId)!.valorEscala,
                }
              : undefined
          }
        />
      )}
    </>
  );
};