import { ReactNode, useState } from "react";
import { Calendar, LayoutDashboard, Users, Settings, Menu, Bell, ChevronLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/" },
    { title: "Eventos", icon: Calendar, url: "/eventos" },
    { title: "Equipe", icon: Users, url: "/equipe" },
    { title: "Configurações", icon: Settings, url: "/configuracoes" },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
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
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-sidebar-accent text-sidebar-foreground"
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-border bg-card flex items-center justify-between px-8">
          <div>
            <h2 className="font-display font-semibold text-2xl text-foreground">
              Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Bem-vindo ao sistema de gestão
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
