import { Avaliacao, AvaliacaoFormData } from "@/types/avaliacao";

const AVALIACOES_KEY = "buffet_avaliacoes";

export const avaliacoesStorage = {
  getAll: (): Avaliacao[] => {
    try {
      const data = localStorage.getItem(AVALIACOES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      return [];
    }
  },

  getByEventoId: (eventoId: string): Avaliacao[] => {
    const avaliacoes = avaliacoesStorage.getAll();
    return avaliacoes.filter(av => av.eventoId === eventoId);
  },

  getByMembroAndEvento: (membroId: string, eventoId: string): Avaliacao | undefined => {
    const avaliacoes = avaliacoesStorage.getAll();
    return avaliacoes.find(av => av.membroId === membroId && av.eventoId === eventoId);
  },

  create: (data: AvaliacaoFormData): Avaliacao => {
    const avaliacoes = avaliacoesStorage.getAll();
    
    // Remove avaliação anterior do mesmo membro/evento se existir
    const filtered = avaliacoes.filter(
      av => !(av.membroId === data.membroId && av.eventoId === data.eventoId)
    );
    
    const novaAvaliacao: Avaliacao = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    filtered.push(novaAvaliacao);
    localStorage.setItem(AVALIACOES_KEY, JSON.stringify(filtered));
    return novaAvaliacao;
  },

  isEventoAvaliado: (eventoId: string, totalMembros: number): boolean => {
    const avaliacoes = avaliacoesStorage.getByEventoId(eventoId);
    return avaliacoes.length === totalMembros && totalMembros > 0;
  },

  isMembroAvaliado: (membroId: string, eventoId: string): boolean => {
    return avaliacoesStorage.getByMembroAndEvento(membroId, eventoId) !== undefined;
  },
};