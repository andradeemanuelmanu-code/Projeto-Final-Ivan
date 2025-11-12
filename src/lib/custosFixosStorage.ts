import { CustoFixo, CustoFixoFormData } from "@/types/custoFixo";

const STORAGE_KEY = "buffet_custos_fixos";

export const custosFixosStorage = {
  getAll: (): CustoFixo[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar custos fixos:", error);
      return [];
    }
  },

  getByMes: (mesReferencia: string): CustoFixo[] => {
    const custos = custosFixosStorage.getAll();
    return custos.filter(custo => custo.mesReferencia === mesReferencia);
  },

  create: (data: CustoFixoFormData): CustoFixo => {
    const custos = custosFixosStorage.getAll();
    const novoCusto: CustoFixo = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    custos.push(novoCusto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custos));
    return novoCusto;
  },

  update: (id: string, data: Partial<CustoFixoFormData>): CustoFixo | null => {
    const custos = custosFixosStorage.getAll();
    const index = custos.findIndex(custo => custo.id === id);
    
    if (index === -1) return null;
    
    custos[index] = {
      ...custos[index],
      ...data,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custos));
    return custos[index];
  },

  delete: (id: string): boolean => {
    const custos = custosFixosStorage.getAll();
    const filtered = custos.filter(custo => custo.id !== id);
    
    if (filtered.length === custos.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getTotalByMes: (mesReferencia: string): number => {
    const custos = custosFixosStorage.getByMes(mesReferencia);
    return custos.reduce((total, custo) => total + custo.valor, 0);
  },

  getHistoricoMeses: (numMeses: number = 3): Array<{ mes: string; total: number; quantidade: number }> => {
    const custos = custosFixosStorage.getAll();
    const mesesMap = new Map<string, { total: number; quantidade: number }>();
    
    custos.forEach(custo => {
      const existing = mesesMap.get(custo.mesReferencia) || { total: 0, quantidade: 0 };
      mesesMap.set(custo.mesReferencia, {
        total: existing.total + custo.valor,
        quantidade: existing.quantidade + 1,
      });
    });

    const mesesOrdenados = Array.from(mesesMap.entries())
      .map(([mes, data]) => ({ mes, ...data }))
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .slice(0, numMeses);

    return mesesOrdenados;
  },
};
