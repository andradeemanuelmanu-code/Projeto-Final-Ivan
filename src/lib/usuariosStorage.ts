import { Usuario, UsuarioPendente } from "@/types/usuario";

const USUARIO_KEY = "buffet_usuario_logado";
const PENDENTES_KEY = "buffet_usuarios_pendentes";

// USUÁRIO LOGADO
export const usuarioStorage = {
  get: (): Usuario | null => {
    try {
      const data = localStorage.getItem(USUARIO_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      return null;
    }
  },

  set: (usuario: Usuario): void => {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },

  update: (data: Partial<Usuario>): Usuario | null => {
    const usuario = usuarioStorage.get();
    if (!usuario) return null;

    const updated = { ...usuario, ...data };
    usuarioStorage.set(updated);
    return updated;
  },

  clear: (): void => {
    localStorage.removeItem(USUARIO_KEY);
  },
};

// USUÁRIOS PENDENTES
export const usuariosPendentesStorage = {
  getAll: (): UsuarioPendente[] => {
    try {
      const data = localStorage.getItem(PENDENTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar usuários pendentes:", error);
      return [];
    }
  },

  create: (data: Omit<UsuarioPendente, "id" | "status" | "criadoEm">): UsuarioPendente => {
    const pendentes = usuariosPendentesStorage.getAll();
    const novo: UsuarioPendente = {
      ...data,
      id: crypto.randomUUID(),
      status: "pendente",
      criadoEm: new Date().toISOString(),
    };
    pendentes.push(novo);
    localStorage.setItem(PENDENTES_KEY, JSON.stringify(pendentes));
    return novo;
  },

  update: (id: string, data: Partial<UsuarioPendente>): UsuarioPendente | null => {
    const pendentes = usuariosPendentesStorage.getAll();
    const index = pendentes.findIndex((u) => u.id === id);

    if (index === -1) return null;

    pendentes[index] = { ...pendentes[index], ...data };
    localStorage.setItem(PENDENTES_KEY, JSON.stringify(pendentes));
    return pendentes[index];
  },

  delete: (id: string): boolean => {
    const pendentes = usuariosPendentesStorage.getAll();
    const filtered = pendentes.filter((u) => u.id !== id);

    if (filtered.length === pendentes.length) return false;

    localStorage.setItem(PENDENTES_KEY, JSON.stringify(filtered));
    return true;
  },

  aprovar: (id: string): boolean => {
    return usuariosPendentesStorage.update(id, { status: "aprovado" }) !== null;
  },

  rejeitar: (id: string): boolean => {
    return usuariosPendentesStorage.delete(id);
  },
};
