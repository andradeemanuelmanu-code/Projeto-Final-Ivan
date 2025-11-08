export type TipoCusto = 
  | "ingredientes"
  | "carvao"
  | "mercado"
  | "bebidas"
  | "descartaveis"
  | "transporte"
  | "locacao";

export interface Custo {
  id: string;
  eventoId: string;
  descricao: string;
  tipo: TipoCusto;
  valor: number;
  data: string;
  criadoEm: string;
}

export interface CustoFormData extends Omit<Custo, "id" | "criadoEm"> {}
