import { FuncaoEquipe } from "./equipe";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
}

export interface UsuarioPendente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: "pendente" | "aprovado" | "rejeitado";
  criadoEm: string;
}

export interface AprovacaoMembroData {
  usuarioId: string;
  funcao: FuncaoEquipe;
}
