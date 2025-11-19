import { Usuario } from "@/types/usuario";

const STORAGE_KEY = "buffet_usuario_logado";

export const usuarioLogadoStorage = {
  get: (): Usuario | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      return null;
    }
  },

  set: (usuario: Usuario): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  },

  update: (data: Partial<Omit<Usuario, 'id' | 'isAdmin'>>): void => {
    const usuario = usuarioLogadoStorage.get();
    if (usuario) {
      const updatedUsuario = { ...usuario, ...data };
      usuarioLogadoStorage.set(updatedUsuario);
    }
  },
};