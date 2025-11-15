import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ResumoFinanceiroCard } from "@/components/financeiro/ResumoFinanceiroCard";
import { GraficoEvolucao } from "@/components/financeiro/GraficoEvolucao";
import { FiltroPeriodo } from "@/components/financeiro/FiltroPeriodo";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Receipt,
  Wallet,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { eventosStorage } from "@/lib/eventosStorage";
import { custosStorage } from "@/lib/custosStorage";
import { custosFixosStorage } from "@/lib/custosFixosStorage";
import { notasFiscaisStorage } from "@/lib/notasFiscaisStorage";
import { escalasStorage } from "@/lib/equipeStorage";
import { parseLocalDate } from "@/lib/utils";

const Financeiro = () => {
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const [mesReferencia, setMesReferencia] = useState(mesAtual);

  // Calcular dados do mês selecionado
  const dadosMes = useMemo(() => {
    const eventos = eventosStorage.getAll();
    const custos = custosStorage.getAll();
    const custosFixos = custosFixosStorage.getByMes(mesReferencia);
    const notas = notasFiscaisStorage.getAll();
    const escalas = escalasStorage.getAll();

    const eventosMes = eventos.filter((evento) => {
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      return eventoMes === mesReferencia;
    });
    const eventosIds = eventosMes.map((e) => e.id);

    const faturamentoTotal = eventosMes
      .filter(evento => evento.statusPagamento === 'paid')
      .reduce((acc, evento) => acc + evento.valor, 0);

    const custosVariaveis = custos
      .filter((custo) => eventosIds.includes(custo.eventoId))
      .reduce((acc, custo) => acc + custo.valor, 0);

    const totalCustosFixos = custosFixos.reduce((acc, custo) => acc + custo.valor, 0);

    const notasMes = notas.filter((nota) => eventosIds.includes(nota.eventoId));
    const totalImpostos = notasMes.reduce((acc, nota) => acc + nota.valorImposto, 0);

    const custoEquipe = escalas
      .filter(escala => eventosIds.includes(escala.eventoId))
      .flatMap(escala => escala.membros)
      .reduce((acc, membro) => acc + membro.valor, 0);

    const lucroLiquido = faturamentoTotal - custosVariaveis - totalCustosFixos - totalImpostos - custoEquipe;
    const margemLucro = faturamentoTotal > 0 ? (lucroLiquido / faturamentoTotal) * 100 : 0;

    return {
      totalEventos: eventosMes.length,
      faturamentoTotal,
      custosVariaveis,
      custosFixos: totalCustosFixos,
      impostos: totalImpostos,
      custoEquipe,
      lucroLiquido,
      margemLucro,
    };
  }, [mesReferencia]);

  // Calcular dados do mês anterior para comparação
  const dadosMesAnterior = useMemo(() => {
    const [ano, mes] = mesReferencia.split("-").map(Number);
    const dataAnterior = new Date(ano, mes - 2, 1);
    const mesAnterior = `${dataAnterior.getFullYear()}-${String(dataAnterior.getMonth() + 1).padStart(2, "0")}`;

    const eventos = eventosStorage.getAll();
    const custos = custosStorage.getAll();
    const custosFixos = custosFixosStorage.getByMes(mesAnterior);
    const notas = notasFiscaisStorage.getAll();
    const escalas = escalasStorage.getAll();

    const eventosMes = eventos.filter((evento) => {
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      return eventoMes === mesAnterior;
    });
    const eventosIds = eventosMes.map((e) => e.id);

    const faturamentoTotal = eventosMes
      .filter(evento => evento.statusPagamento === 'paid')
      .reduce((acc, evento) => acc + evento.valor, 0);

    const custosVariaveis = custos
      .filter((custo) => eventosIds.includes(custo.eventoId))
      .reduce((acc, custo) => acc + custo.valor, 0);

    const totalCustosFixos = custosFixos.reduce((acc, custo) => acc + custo.valor, 0);

    const notasMes = notas.filter((nota) => eventosIds.includes(nota.eventoId));
    const totalImpostos = notasMes.reduce((acc, nota) => acc + nota.valorImposto, 0);

    const custoEquipe = escalas
      .filter(escala => eventosIds.includes(escala.eventoId))
      .flatMap(escala => escala.membros)
      .reduce((acc, membro) => acc + membro.valor, 0);

    const lucroLiquido = faturamentoTotal - custosVariaveis - totalCustosFixos - totalImpostos - custoEquipe;

    return { lucroLiquido, faturamentoTotal, custoEquipe };
  }, [mesReferencia]);

  const calcularTendencia = (valorAtual: number, valorAnterior: number) => {
    if (valorAnterior === 0) {
      return { valor: "N/A", positiva: valorAtual > 0 };
    }
    const percentual = ((valorAtual - valorAnterior) / valorAnterior) * 100;
    return {
      valor: `${Math.abs(percentual).toFixed(1)}% vs mês anterior`,
      positiva: percentual >= 0,
    };
  };

  const dadosGraficos = useMemo(() => {
    const hoje = new Date();
    const dadosLinha = [];
    const dadosBarras = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
      const mesLabel = data.toLocaleDateString("pt-BR", { month: "short" });

      const eventos = eventosStorage.getAll();
      const custos = custosStorage.getAll();
      const custosFixos = custosFixosStorage.getByMes(mes);
      const notas = notasFiscaisStorage.getAll();
      const escalas = escalasStorage.getAll();

      const eventosMes = eventos.filter((evento) => {
        const eventoData = parseLocalDate(evento.data);
        const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
        return eventoMes === mes;
      });
      const eventosIds = eventosMes.map((e) => e.id);

      const faturamento = eventosMes
        .filter(evento => evento.statusPagamento === 'paid')
        .reduce((acc, evento) => acc + evento.valor, 0);

      const custosVariaveisEvento = custos
        .filter((custo) => eventosIds.includes(custo.eventoId))
        .reduce((acc, custo) => acc + custo.valor, 0);
      
      const custoEquipe = escalas
        .filter(escala => eventosIds.includes(escala.eventoId))
        .flatMap(escala => escala.membros)
        .reduce((acc, membro) => acc + membro.valor, 0);

      const totalCustosFixos = custosFixos.reduce((acc, custo) => acc + custo.valor, 0);
      const impostos = notas.filter(n => eventosIds.includes(n.eventoId)).reduce((acc, nota) => acc + nota.valorImposto, 0);
      const lucro = faturamento - custosVariaveisEvento - custoEquipe - totalCustosFixos - impostos;

      dadosLinha.push({ mes: mesLabel, faturamento, lucro });
      dadosBarras.push({ mes: mesLabel, custosFixos: totalCustosFixos, custosVariaveis: custosVariaveisEvento + custoEquipe });
    }

    return { dadosLinha, dadosBarras };
  }, []);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <DashboardLayout
      title="Resumo Financeiro"
      description="Acompanhe o desempenho financeiro do seu buffet"
    >
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Financeiro</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4">
          <FiltroPeriodo
            mesReferencia={mesReferencia}
            onMesChange={setMesReferencia}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResumoFinanceiroCard
            titulo="Faturamento Total"
            valor={formatarMoeda(dadosMes.faturamentoTotal)}
            subtitulo="Receita de eventos pagos"
            icon={DollarSign}
            tendencia={calcularTendencia(dadosMes.faturamentoTotal, dadosMesAnterior.faturamentoTotal)}
          />
          <ResumoFinanceiroCard
            titulo="Lucro Líquido"
            valor={formatarMoeda(dadosMes.lucroLiquido)}
            subtitulo="Após custos e impostos"
            icon={dadosMes.lucroLiquido >= 0 ? TrendingUp : TrendingDown}
            tendencia={calcularTendencia(dadosMes.lucroLiquido, dadosMesAnterior.lucroLiquido)}
          />
          <ResumoFinanceiroCard
            titulo="Margem de Lucro"
            valor={`${dadosMes.margemLucro.toFixed(1)}%`}
            subtitulo="Sobre faturamento"
            icon={Percent}
          />
          <ResumoFinanceiroCard
            titulo="Total de Eventos"
            valor={dadosMes.totalEventos}
            subtitulo="Eventos no período"
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResumoFinanceiroCard
            titulo="Custos Variáveis"
            valor={formatarMoeda(dadosMes.custosVariaveis)}
            subtitulo="Custos por evento"
            icon={Receipt}
          />
          <ResumoFinanceiroCard
            titulo="Custo com Equipe"
            valor={formatarMoeda(dadosMes.custoEquipe)}
            subtitulo="Pagamento da equipe"
            icon={Users}
            tendencia={calcularTendencia(dadosMes.custoEquipe, dadosMesAnterior.custoEquipe)}
          />
          <ResumoFinanceiroCard
            titulo="Custos Fixos"
            valor={formatarMoeda(dadosMes.custosFixos)}
            subtitulo="Despesas mensais"
            icon={Wallet}
          />
          <ResumoFinanceiroCard
            titulo="Impostos"
            valor={formatarMoeda(dadosMes.impostos)}
            subtitulo="Tributos do período"
            icon={Receipt}
          />
        </div>

        <GraficoEvolucao
          dadosLinha={dadosGraficos.dadosLinha}
          dadosBarras={dadosGraficos.dadosBarras}
        />
      </div>
    </DashboardLayout>
  );
};

export default Financeiro;