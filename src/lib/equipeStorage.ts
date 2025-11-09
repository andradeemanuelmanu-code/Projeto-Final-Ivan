import { MembroEquipe, MembroEquipeFormData, EscalaEvento, EscalaEventoFormData } from "@/types/equipe";

const MEMBROS_KEY = "buffet_membros_equipe";
const ESCALAS_KEY = "buffet_escalas_eventos";

// MEMBROS DA EQUIPE
export const membrosStorage = {
  getAll: (): MembroEquipe[] => {
    try {
      const data = localStorage.getItem(MEMBROS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      return [];
    }
  },

  getById: (id: string): MembroEquipe | undefined => {
    const membros = membrosStorage.getAll();
    return membros.find(membro => membro.id === id);
  },

  create: (data: MembroEquipeFormData): MembroEquipe => {
    const membros = membrosStorage.getAll();
    const novoMembro: MembroEquipe = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    membros.push(novoMembro);
    localStorage.setItem(MEMBROS_KEY, JSON.stringify(membros));
    return novoMembro;
  },

  update: (id: string, data: Partial<MembroEquipeFormData>): MembroEquipe | null => {
    const membros = membrosStorage.getAll();
    const index = membros.findIndex(membro => membro.id === id);
    
    if (index === -1) return null;
    
    membros[index] = {
      ...membros[index],
      ...data,
      atualizadoEm: new Date().toISOString(),
    };
    
    localStorage.setItem(MEMBROS_KEY, JSON.stringify(membros));
    return membros[index];
  },

  delete: (id: string): boolean => {
    const membros = membrosStorage.getAll();
    const filtered = membros.filter(membro => membro.id !== id);
    
    if (filtered.length === membros.length) return false;
    
    localStorage.setItem(MEMBROS_KEY, JSON.stringify(filtered));
    return true;
  },
};

// ESCALAS DE EVENTOS
export const escalasStorage = {
  getAll: (): EscalaEvento[] => {
    try {
      const data = localStorage.getItem(ESCALAS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar escalas:", error);
      return [];
    }
  },

  getByEventoId: (eventoId: string): EscalaEvento | undefined => {
    const escalas = escalasStorage.getAll();
    return escalas.find(escala => escala.eventoId === eventoId);
  },

  create: (data: EscalaEventoFormData): EscalaEvento => {
    const escalas = escalasStorage.getAll();
    
    // Remove escala anterior do mesmo evento se existir
    const filtered = escalas.filter(e => e.eventoId !== data.eventoId);
    
    const novaEscala: EscalaEvento = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    filtered.push(novaEscala);
    localStorage.setItem(ESCALAS_KEY, JSON.stringify(filtered));
    return novaEscala;
  },

  update: (eventoId: string, data: Partial<EscalaEventoFormData>): EscalaEvento | null => {
    const escalas = escalasStorage.getAll();
    const index = escalas.findIndex(escala => escala.eventoId === eventoId);
    
    if (index === -1) return null;
    
    escalas[index] = {
      ...escalas[index],
      ...data,
      atualizadoEm: new Date().toISOString(),
    };
    
    localStorage.setItem(ESCALAS_KEY, JSON.stringify(escalas));
    return escalas[index];
  },

  hasEscala: (eventoId: string): boolean => {
    return escalasStorage.getByEventoId(eventoId) !== undefined;
  },
};
