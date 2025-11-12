import { Evento, EventoFormData } from "@/types/evento";

const STORAGE_KEY = "buffet_eventos";

export const eventosStorage = {
  getAll: (): Evento[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      return [];
    }
  },

  getById: (id: string): Evento | undefined => {
    const eventos = eventosStorage.getAll();
    return eventos.find(evento => evento.id === id);
  },

  create: (data: EventoFormData): Evento => {
    const eventos = eventosStorage.getAll();
    const novoEvento: Evento = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    eventos.push(novoEvento);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
    return novoEvento;
  },

  update: (id: string, data: Partial<EventoFormData>): Evento | null => {
    const eventos = eventosStorage.getAll();
    const index = eventos.findIndex(evento => evento.id === id);
    
    if (index === -1) return null;
    
    eventos[index] = {
      ...eventos[index],
      ...data,
      atualizadoEm: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
    return eventos[index];
  },

  delete: (id: string): boolean => {
    const eventos = eventosStorage.getAll();
    const filtered = eventos.filter(evento => evento.id !== id);
    
    if (filtered.length === eventos.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getAllSorted: (): Evento[] => {
    const eventos = eventosStorage.getAll();
    return eventos.sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataA - dataB;
    });
  },
};
