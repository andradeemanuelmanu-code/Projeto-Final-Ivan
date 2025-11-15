import { Opcao } from "@/types/opcoes";

const CARDAPIO_KEY = "buffet_opcoes_cardapio";
const BEBIDAS_KEY = "buffet_opcoes_bebidas";

const defaultCardapioOptions: Opcao[] = [
  { value: "churrasco-tradicional", label: "Churrasco Tradicional" },
  { value: "churrasco-prime", label: "Churrasco Prime" },
  { value: "massas", label: "Massas" },
  { value: "roda-boteco", label: "Roda de Boteco" },
];

const defaultBebidasOptions: Opcao[] = [
  { value: "agua", label: "Água" },
  { value: "refrigerante", label: "Refrigerante" },
  { value: "suco", label: "Suco" },
  { value: "cerveja", label: "Cerveja" },
];

const createSlug = (label: string) => {
  return label
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const getOptions = (key: string, defaults: Opcao[]): Opcao[] => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    // Se não houver dados, inicializa com os padrões
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  } catch (error) {
    console.error(`Erro ao carregar opções de ${key}:`, error);
    return defaults;
  }
};

const addOption = (key: string, label: string): Opcao[] => {
  const options = getOptions(key, []);
  const newOption: Opcao = {
    label,
    value: createSlug(label),
  };
  
  if (options.some(o => o.value === newOption.value)) {
    // Evita duplicados
    return options;
  }

  const updatedOptions = [...options, newOption];
  localStorage.setItem(key, JSON.stringify(updatedOptions));
  return updatedOptions;
};

const deleteOption = (key: string, value: string): Opcao[] => {
  const options = getOptions(key, []);
  const updatedOptions = options.filter(o => o.value !== value);
  localStorage.setItem(key, JSON.stringify(updatedOptions));
  return updatedOptions;
};

export const opcoesStorage = {
  getCardapioOptions: () => getOptions(CARDAPIO_KEY, defaultCardapioOptions),
  addCardapioOption: (label: string) => addOption(CARDAPIO_KEY, label),
  deleteCardapioOption: (value: string) => deleteOption(CARDAPIO_KEY, value),

  getBebidasOptions: () => getOptions(BEBIDAS_KEY, defaultBebidasOptions),
  addBebidaOption: (label: string) => addOption(BEBIDAS_KEY, label),
  deleteBebidaOption: (value: string) => deleteOption(BEBIDAS_KEY, value),
};