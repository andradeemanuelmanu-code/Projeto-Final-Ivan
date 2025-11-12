export type StatusPagamento = "pending" | "quote" | "paid";
export type MetodoPagamento = "pix" | "credito" | "debito" | "boleto";
export type TipoCardapio = 
  | "churrasco-tradicional"
  | "churrasco-prime"
  | "churrasco-vip"
  | "massas"
  | "roda-boteco"
  | "coffee-break"
  | "evento-kids"
  | "jantar";

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
  metodoPagamento: MetodoPagamento;
  statusPagamento: StatusPagamento;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EventoFormData extends Omit<Evento, "id" | "criadoEm" | "atualizadoEm"> {}
