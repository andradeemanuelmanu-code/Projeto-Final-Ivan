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
  funcao: FuncaoEquipe;
  telefone: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface MembroEquipeFormData extends Omit<MembroEquipe, "id" | "criadoEm" | "atualizadoEm"> {}

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