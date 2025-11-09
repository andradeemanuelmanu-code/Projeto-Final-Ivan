export type TipoNota = "nfe" | "rps" | "outro";
export type TipoImposto = "iss" | "simples-nacional" | "outro";
export type SituacaoNota = "emitida" | "nao-emitida" | "aguardando";
export type SituacaoImposto = "pago" | "pendente";

export interface NotaFiscal {
  id: string;
  eventoId: string;
  emitirNota: boolean;
  tipoNota: TipoNota;
  valorTributavel: number;
  tipoImposto: TipoImposto;
  valorImposto: number;
  situacaoNota: SituacaoNota;
  situacaoImposto: SituacaoImposto;
  criadoEm: string;
  atualizadoEm: string;
}

export interface NotaFiscalFormData extends Omit<NotaFiscal, "id" | "criadoEm" | "atualizadoEm"> {}
