import { NotaFiscal, NotaFiscalFormData } from "@/types/notaFiscal";

const STORAGE_KEY = "buffet_notas_fiscais";

export const notasFiscaisStorage = {
  getAll: (): NotaFiscal[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar notas fiscais:", error);
      return [];
    }
  },

  getByEventoId: (eventoId: string): NotaFiscal | undefined => {
    const notas = notasFiscaisStorage.getAll();
    return notas.find(nota => nota.eventoId === eventoId);
  },

  create: (data: NotaFiscalFormData): NotaFiscal => {
    const notas = notasFiscaisStorage.getAll();
    const novaNota: NotaFiscal = {
      ...data,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    notas.push(novaNota);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
    return novaNota;
  },

  update: (id: string, data: Partial<NotaFiscalFormData>): NotaFiscal | null => {
    const notas = notasFiscaisStorage.getAll();
    const index = notas.findIndex(nota => nota.id === id);
    
    if (index === -1) return null;
    
    notas[index] = {
      ...notas[index],
      ...data,
      atualizadoEm: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
    return notas[index];
  },

  delete: (id: string): boolean => {
    const notas = notasFiscaisStorage.getAll();
    const filtered = notas.filter(nota => nota.id !== id);
    
    if (filtered.length === notas.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getResumo: () => {
    const notas = notasFiscaisStorage.getAll();
    
    const totalEmitidas = notas.filter(n => n.situacaoNota === "emitida").length;
    const totalImpostosPagos = notas
      .filter(n => n.situacaoImposto === "pago")
      .reduce((acc, n) => acc + n.valorImposto, 0);
    const totalImpostosPendentes = notas
      .filter(n => n.situacaoImposto === "pendente")
      .reduce((acc, n) => acc + n.valorImposto, 0);
    
    const totalTributavel = notas.reduce((acc, n) => acc + n.valorTributavel, 0);
    const totalImpostos = notas.reduce((acc, n) => acc + n.valorImposto, 0);
    const percentualMedio = totalTributavel > 0 ? (totalImpostos / totalTributavel) * 100 : 0;
    
    return {
      totalEmitidas,
      totalImpostosPagos,
      totalImpostosPendentes,
      percentualMedio,
    };
  },
};
