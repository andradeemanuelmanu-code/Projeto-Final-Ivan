export type TipoCustoFixo = 
  | "internet"
  | "aluguel"
  | "agua"
  | "energia"
  | "gasolina"
  | "outros";

export interface CustoFixo {
  id: string;
  descricao: string;
  tipo: TipoCustoFixo;
  valor: number;
  mesReferencia: string; // formato: "2025-11"
  eventoId?: string;
  criadoEm: string;
}

export interface CustoFixoFormData extends Omit<CustoFixo, "id" | "criadoEm"> {}
