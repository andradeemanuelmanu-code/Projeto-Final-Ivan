import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Eventos from "./pages/Eventos";
import Agenda from "./pages/Agenda";
import CustosPorEvento from "./pages/CustosPorEvento";
import CustosFixosMensais from "./pages/CustosFixosMensais";
import Escala from "./pages/Escala";
import Avaliacoes from "./pages/Avaliacoes";
import GestaoFiscal from "./pages/GestaoFiscal";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/custos-por-evento" element={<CustosPorEvento />} />
          <Route path="/custos-fixos-mensais" element={<CustosFixosMensais />} />
          <Route path="/escala" element={<Escala />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/gestao-fiscal" element={<GestaoFiscal />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;