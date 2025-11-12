import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserSettingsForm } from "@/components/configuracoes/UserSettingsForm";
import { ThemeToggle } from "@/components/configuracoes/ThemeToggle";
import { AdminMembersPanel } from "@/components/configuracoes/AdminMembersPanel";
import { usuarioStorage } from "@/lib/usuariosStorage";
import { initializeMockUsuariosPendentes } from "@/lib/initializeMockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Palette, Shield } from "lucide-react";

const Configuracoes = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Inicializa usuário padrão se não existir
    let usuario = usuarioStorage.get();
    if (!usuario) {
      usuario = {
        id: crypto.randomUUID(),
        nome: "Admin",
        email: "admin@buffet.com",
        isAdmin: true,
      };
      usuarioStorage.set(usuario);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conta" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Aparência
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

          <TabsContent value="aparencia" className="mt-6">
            <ThemeToggle />
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