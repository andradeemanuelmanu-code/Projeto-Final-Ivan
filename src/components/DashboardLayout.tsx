import { ReactNode, useState } from "react";
import { Calendar, LayoutDashboard, Users, Settings, Menu, ChevronLeft, DollarSign, Receipt, Star, FileText, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/" },
    { title: "Eventos", icon: Calendar, url: "/eventos" },
    { title: "Agenda", icon: Calendar, url: "/agenda" },
    { title: "Custos por Evento", icon: DollarSign, url: "/custos-por-evento" },
    { title: "Custos Fixos Mensais", icon: Receipt, url: "/custos-fixos-mensais" },
    { title: "Equipe", icon: Users, url: "/equipe" },
    { title: "Avaliações", icon: Star, url: "/avaliacoes" },
    { title: "Gestão Fiscal", icon: FileText, url: "/gestao-fiscal" },
    { title: "Financeiro", icon: TrendingUp, url: "/financeiro" },
  ];

  const handleNavClick = () => {
    // Em telas pequenas, recolhe o menu ao clicar em um item
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-40",
          "h-screen sticky top-0",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo e Botão de Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border">
          {!sidebarCollapsed && (
            <h1 className="font-display font-bold text-xl text-sidebar-foreground">
              Gestão Buffet
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-sidebar-accent"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 p-4 flex flex-col gap-2", sidebarCollapsed && "items-center")}>
          {menuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={handleNavClick}
              className={cn(
                "flex items-center rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent",
                sidebarCollapsed ? "w-12 h-12 justify-center" : "px-4 py-3 gap-3 text-base"
              )}
              activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-medium text-sm text-sidebar-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@buffet.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        {/* Header */}
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
                {title || "Dashboard"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                {description || "Bem-vindo ao sistema de gestão"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationDropdown />
            <NavLink
              to="/configuracoes"
              activeClassName="text-primary bg-accent/10 rounded-lg"
            >
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;