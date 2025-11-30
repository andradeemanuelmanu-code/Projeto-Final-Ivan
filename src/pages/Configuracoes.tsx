import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserSettingsForm } from "@/components/configuracoes/UserSettingsForm";
import { AdminMembersPanel } from "@/components/configuracoes/AdminMembersPanel";
import { usuarioLogadoStorage } from "@/lib/usuarioLogadoStorage";
import { initializeMockUsuariosPendentes } from "@/lib/initializeMockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const Configuracoes = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Inicializa usuário padrão se não existir
    let usuario = usuarioLogadoStorage.get();
    if (!usuario) {
      usuario = {
        id: crypto.randomUUID(),
        nome: "Admin",
        email: "admin@buffet.com",
        isAdmin: true,
      };
      usuarioLogadoStorage.set(usuario);
    }
    setIsAdmin(usuario.isAdmin);

    // Inicializa dados mock
    if (usuario.isAdmin) {
      initializeMockUsuariosPendentes();
    }
  }, []);

  return (
    <DashboardLayout
      title="Configurações"
      description="Gerencie suas preferências e configurações do sistema"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="conta" className="w-full">
          <TabsList className={cn("grid w-full", isAdmin ? "grid-cols-2" : "grid-cols-1")}>
            <TabsTrigger value="conta" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Conta
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Administração
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="conta" className="mt-6">
            <UserSettingsForm />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <AdminMembersPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;