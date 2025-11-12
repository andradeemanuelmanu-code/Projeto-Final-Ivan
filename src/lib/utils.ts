import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";

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
