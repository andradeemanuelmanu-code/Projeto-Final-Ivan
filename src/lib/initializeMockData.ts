import { equipeStorage } from "./equipeStorage";

export const initializeMockUsuariosPendentes = () => {
  const pendentes = equipeStorage.getPendentes();
  
  if (pendentes.length === 0) {
    equipeStorage.solicitarAdesao({
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321",
    });

    equipeStorage.solicitarAdesao({
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 97654-3210",
    });

    equipeStorage.solicitarAdesao({
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      telefone: "(11) 96543-2109",
    });
  }
};