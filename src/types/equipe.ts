export type FuncaoEquipe = 
  | "cozinheira"
  | "ajudante-cozinheira"
  | "churrasqueiro"
  | "ajudante-churrasqueiro"
  | "garcom"
  | "barman"
  | "maitre";

export interface MembroEquipe {
  id: string;
  nome: string;
  funcaoPrincipal: FuncaoEquipe;
  funcoesSecundarias: FuncaoEquipe[];
  telefone: string;
  email: string;
  status: "pendente" | "ativo";
  criadoEm: string;
  atualizadoEm: string;
}

export interface MembroEquipeFormData extends Omit<MembroEquipe, "id" | "criadoEm" | "atualizadoEm" | "status"> {}

export interface SolicitacaoMembroData {
  nome: string;
  email: string;
  telefone: string;
}

export interface MembroEscalado {
  membroId: string;
  funcao: FuncaoEquipe;
}

export interface EscalaEvento {
  id: string;
  eventoId: string;
  membros: MembroEscalado[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface EscalaEventoFormData {
  eventoId: string;
  membros: MembroEscalado[];
}