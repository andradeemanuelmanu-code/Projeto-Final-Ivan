import { usuariosPendentesStorage } from "./usuariosStorage";

export const initializeMockUsuariosPendentes = () => {
  const existentes = usuariosPendentesStorage.getAll();
  
  // Só adiciona usuários mock se não houver nenhum pendente
  if (existentes.filter(u => u.status === "pendente").length === 0) {
    usuariosPendentesStorage.create({
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321",
    });

    usuariosPendentesStorage.create({
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 97654-3210",
    });

    usuariosPendentesStorage.create({
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      telefone: "(11) 96543-2109",
    });
  }
};
