import { ReactNode, useState } from "react";
import { Calendar, LayoutDashboard, Users, Settings, Menu, ChevronLeft, DollarSign, Receipt, Star, FileText, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggleButton } from "@/components/layout/ThemeToggleButton";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // A sidebar está expandida se não estiver colapsada no desktop, ou se for a visualização mobile.
  const isExpanded = !sidebarCollapsed || isMobile;

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/" },
    { title: "Eventos", icon: Calendar, url: "/eventos" },
    { title: "Agenda", icon: Calendar, url: "/agenda" },
    { title: "Custos por Evento", icon: DollarSign, url: "/custos-por-evento" },
    { title: "Custos Fixos Mensais", icon: Receipt, url: "/custos-fixos-mensais" },
    { title: "Escala", icon: Users, url: "/escala" },
    { title: "Avaliações", icon: Star, url: "/avaliacoes" },
    { title: "Gestão Fiscal", icon: FileText, url: "/gestao-fiscal" },
    { title: "Financeiro", icon: TrendingUp, url: "/financeiro" },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          "fixed top-0 left-0 h-screen z-50",
          "lg:sticky lg:z-auto",
          isExpanded ? "w-72" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border">
          {isExpanded && (
            <h1 className="font-display font-bold text-xl text-sidebar-foreground">
              Gestão Buffet
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-sidebar-accent hidden lg:flex"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base",
                "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
              activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
            >
              <item.icon size={20} />
              {isExpanded && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center", !isExpanded && "justify-center")}>
            {isExpanded && (
              <div className="flex-1 px-4">
                <p className="font-medium text-sm text-sidebar-foreground">Admin</p>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>
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
            <ThemeToggleButton />
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