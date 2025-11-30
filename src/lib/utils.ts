import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";
import { Opcao } from "@/types/opcoes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converte uma string de data no formato "YYYY-MM-DD" para um objeto Date
 * sem problemas de timezone. Garante que a data seja interpretada como
 * data local, não UTC.
 * 
 * @param dateString - String no formato "YYYY-MM-DD"
 * @returns Date object interpretado como data local
 */
export function parseLocalDate(dateString: string): Date {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

/**
 * Formata uma lista de valores (ex: ['churrasco-prime']) para uma string de labels legíveis
 * (ex: "Churrasco Prime") buscando as opções correspondentes no storage.
 * 
 * @param values - Array de strings com os valores a serem formatados.
 * @param getOptions - Função que retorna a lista de Opcao[] do storage.
 * @returns Uma string com os labels formatados, separados por vírgula, ou "Não definido".
 */
export function formatarOpcoes(values: string[], getOptions: () => Opcao[]): string {
  if (!values || values.length === 0) {
    return "Não definido";
  }

  const options = getOptions();
  const labels = values.map(value => {
    const option = options.find(o => o.value === value);
    if (option) {
      return option.label;
    }
    // Fallback: formata o value para ser mais legível
    return value.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  });

  return labels.join(", ");
}