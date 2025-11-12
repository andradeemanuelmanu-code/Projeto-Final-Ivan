export type AvaliacaoTrabalho = "ruim" | "razoavel" | "bom" | "excelente";
export type AvaliacaoPontualidade = "atrasado" | "no-horario" | "adiantado";

export interface Avaliacao {
  id: string;
  eventoId: string;
  membroId: string;
  avaliacaoTrabalho: AvaliacaoTrabalho;
  pontualidade: AvaliacaoPontualidade;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AvaliacaoFormData {
  eventoId: string;
  membroId: string;
  avaliacaoTrabalho: AvaliacaoTrabalho;
  pontualidade: AvaliacaoPontualidade;
}
