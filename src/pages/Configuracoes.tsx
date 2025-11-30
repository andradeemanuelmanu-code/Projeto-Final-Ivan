import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserSettingsForm } from "@/components/configuracoes/UserSettingsForm";
import { AdminMembersPanel } from "@/components/configuracoes/AdminMembersPanel";
import { usuarioLogadoStorage } from "@/lib/usuarioLogadoStorage";
import { initializeMockUsuariosPendentes } from "@/lib/initializeMockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="conta" className="w-full">
          <TabsList className={cn("grid w-full", isAdmin ? "grid-cols-2" : "grid-cols-1")}>
            <TabsTrigger value="conta" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Conta
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <div className="flex flex-col items-start leading-tight">
                  <span>Gerenciamento</span>
                  <span>de Membros</span>
                </div>
              </TabsTrigger>
            )}
          </TabsList>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <TabsContent value="conta" className="mt-0">
                <UserSettingsForm />
              </TabsContent>
              {isAdmin && (
                <TabsContent value="admin" className="mt-0">
                  <AdminMembersPanel />
                </TabsContent>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;