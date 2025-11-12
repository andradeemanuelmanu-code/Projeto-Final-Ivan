import { Custo, CustoFormData } from "@/types/custo";

const STORAGE_KEY = "buffet_custos";

export const custosStorage = {
  getAll: (): Custo[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar custos:", error);
      return [];
    }
  },

  getByEventoId: (eventoId: string): Custo[] => {
    const custos = custosStorage.getAll();
    return custos.filter(custo => custo.eventoId === eventoId);
  },

  create: (data: CustoFormData): Custo => {
    const custos = custosStorage.getAll();
    const novoCusto: Custo = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    custos.push(novoCusto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custos));
    return novoCusto;
  },

  getTotalByEventoId: (eventoId: string): number => {
    const custos = custosStorage.getByEventoId(eventoId);
    return custos.reduce((total, custo) => total + custo.valor, 0);
  },

  hasEventoCosts: (eventoId: string): boolean => {
    return custosStorage.getByEventoId(eventoId).length > 0;
  },
};
