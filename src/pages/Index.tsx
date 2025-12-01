import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import EventCard from "@/components/EventCard";
import CalendarWidget from "@/components/CalendarWidget";
import { Calendar, DollarSign, Receipt, Clock } from "lucide-react";
import { eventosStorage } from "@/lib/eventosStorage";
import { custosStorage } from "@/lib/custosStorage";
import { custosFixosStorage } from "@/lib/custosFixosStorage";
import { avaliacoesStorage } from "@/lib/avaliacoesStorage";
import { notasFiscaisStorage } from "@/lib/notasFiscaisStorage";
import { Evento } from "@/types/evento";
import { parseLocalDate } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Index = () => {
  const eventos = useMemo(() => eventosStorage.getAllSorted(), []);

  // --- Cálculos para os Metric Cards ---
  const metricas = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // 1. Eventos este mês
    const eventosEsteMes = eventos.filter(e => {
      const dataEvento = parseLocalDate(e.data);
      return dataEvento.getMonth() === mesAtual && dataEvento.getFullYear() === anoAtual;
    });

    // 2. Receita Total (Mês Atual)
    const receitaMes = eventosEsteMes.reduce((acc, e) => acc + e.valor, 0);

    // 3. Pagamentos Pendentes
    const eventosPendentes = eventos.filter(e => e.statusPagamento === 'pending');
    const totalPendente = eventosPendentes.reduce((acc, e) => acc + e.valor, 0);

    // 4. Despesas do Mês
    const mesReferencia = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}`;
    const custosFixosMes = custosFixosStorage.getTotalByMes(mesReferencia);
    
    const idsEventosMes = eventosEsteMes.map(e => e.id);
    const custosVariaveisEventos = idsEventosMes.reduce((acc, id) => acc + custosStorage.getTotalByEventoId(id), 0);
    
    const avaliacoes = avaliacoesStorage.getAll();
    const custosEquipe = avaliacoes
      .filter(av => idsEventosMes.includes(av.eventoId))
      .reduce((acc, av) => acc + av.valorEscala, 0);
      
    const notas = notasFiscaisStorage.getAll();
    const impostosMes = notas
      .filter(n => idsEventosMes.includes(n.eventoId))
      .reduce((acc, n) => acc + n.valorImposto, 0);

    const despesasTotais = custosFixosMes + custosVariaveisEventos + custosEquipe + impostosMes;

    return [
      {
        title: "Eventos Este Mês",
        value: eventosEsteMes.length,
        subtitle: `${eventosEsteMes.filter(e => parseLocalDate(e.data) >= hoje).length} a realizar`,
        icon: Calendar,
      },
      {
        title: "Receita do Mês",
        value: receitaMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        subtitle: "Faturamento dos eventos do mês",
        icon: DollarSign,
      },
      {
        title: "Pagamentos Pendentes",
        value: eventosPendentes.length,
        subtitle: `Totalizando ${totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        icon: Clock,
      },
      {
        title: "Despesas do Mês",
        value: despesasTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        subtitle: "Soma de custos fixos e variáveis",
        icon: Receipt,
      }
    ];
  }, [eventos]);

  // --- Próximos Eventos ---
  const proximosEventos = useMemo(() => {
    const hoje = new Date();
    // Remove a parte de hora/minuto para comparar apenas a data
    hoje.setHours(0, 0, 0, 0); 
    
    return eventos
      .filter(e => parseLocalDate(e.data) >= hoje)
      .slice(0, 4);
  }, [eventos]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Events and Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-xl">Próximos Eventos</h2>
              <a href="/agenda" className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver todos
              </a>
            </div>
            {proximosEventos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proximosEventos.map((evento: Evento) => (
                  <EventCard
                    key={evento.id}
                    title={evento.motivo}
                    client={evento.cliente.nome}
                    date={format(parseLocalDate(evento.data), "dd/MM/yyyy", { locale: ptBR })}
                    location={evento.endereco}
                    guests={evento.convidados}
                    value={evento.valor}
                    status={evento.statusPagamento}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-card rounded-lg p-8">
                <p className="text-muted-foreground">Nenhum evento futuro agendado.</p>
              </div>
            )}
          </div>

          {/* Calendar Widget */}
          <div className="lg:col-span-1">
            <CalendarWidget eventos={eventos} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;