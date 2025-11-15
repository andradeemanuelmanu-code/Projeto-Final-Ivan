export type StatusPagamento = "pending" | "quote" | "paid";
export type MetodoPagamento = "pix" | "credito" | "debito" | "boleto";
export type TipoCardapio = string; // Alterado para string para permitir opções dinâmicas

export interface Evento {
  id: string;
  motivo: string;
  cliente: {
    nome: string;
    celular: string;
    email: string;
  };
  data: string;
  convidados: number;
  cardapio: TipoCardapio[];
  bebidas: string[];
  horario: {
    inicio: string;
    termino: string;
  };
  endereco: string;
  valor: number;
  valorEntrada?: number; // Campo adicionado
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EventoFormData extends Omit<Evento, "id" | "criadoEm" | "atualizadoEm"> {}