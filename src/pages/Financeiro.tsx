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

    // Filtrar eventos do mês e que já foram executados (data passada)
    const eventosMes = eventos.filter((evento) => {
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      const jaExecutado = eventoData < new Date();
      return eventoMes === mesReferencia && jaExecutado;
    });

    // Calcular faturamento total
    const faturamentoTotal = eventosMes.reduce(
      (acc, evento) => acc + evento.valor,
      0
    );

    // Calcular custos variáveis (custos por evento)
    const eventosIds = eventosMes.map((e) => e.id);
    const custosVariaveis = custos
      .filter((custo) => eventosIds.includes(custo.eventoId))
      .reduce((acc, custo) => acc + custo.valor, 0);

    // Calcular custos fixos
    const totalCustosFixos = custosFixos.reduce(
      (acc, custo) => acc + custo.valor,
      0
    );

    // Calcular impostos
    const notasMes = notas.filter((nota) => {
      const evento = eventos.find((e) => e.id === nota.eventoId);
      if (!evento) return false;
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      return eventoMes === mesReferencia;
    });

    const totalImpostos = notasMes.reduce(
      (acc, nota) => acc + nota.valorImposto,
      0
    );

    // Calcular lucro líquido
    const lucroLiquido =
      faturamentoTotal - custosVariaveis - totalCustosFixos - totalImpostos;

    // Calcular margem de lucro
    const margemLucro =
      faturamentoTotal > 0 ? (lucroLiquido / faturamentoTotal) * 100 : 0;

    return {
      totalEventos: eventosMes.length,
      faturamentoTotal,
      custosVariaveis,
      custosFixos: totalCustosFixos,
      impostos: totalImpostos,
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

    const eventosMes = eventos.filter((evento) => {
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      const jaExecutado = eventoData < new Date();
      return eventoMes === mesAnterior && jaExecutado;
    });

    const faturamentoTotal = eventosMes.reduce(
      (acc, evento) => acc + evento.valor,
      0
    );

    const eventosIds = eventosMes.map((e) => e.id);
    const custosVariaveis = custos
      .filter((custo) => eventosIds.includes(custo.eventoId))
      .reduce((acc, custo) => acc + custo.valor, 0);

    const totalCustosFixos = custosFixos.reduce(
      (acc, custo) => acc + custo.valor,
      0
    );

    const notasMes = notas.filter((nota) => {
      const evento = eventos.find((e) => e.id === nota.eventoId);
      if (!evento) return false;
      const eventoData = parseLocalDate(evento.data);
      const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
      return eventoMes === mesAnterior;
    });

    const totalImpostos = notasMes.reduce(
      (acc, nota) => acc + nota.valorImposto,
      0
    );

    const lucroLiquido =
      faturamentoTotal - custosVariaveis - totalCustosFixos - totalImpostos;

    return {
      lucroLiquido,
      faturamentoTotal,
    };
  }, [mesReferencia]);

  // Calcular tendências
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

  // Dados para gráficos (últimos 6 meses)
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

      const eventosMes = eventos.filter((evento) => {
        const eventoData = parseLocalDate(evento.data);
        const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
        const jaExecutado = eventoData < new Date();
        return eventoMes === mes && jaExecutado;
      });

      const faturamento = eventosMes.reduce(
        (acc, evento) => acc + evento.valor,
        0
      );

      const eventosIds = eventosMes.map((e) => e.id);
      const custosVariaveis = custos
        .filter((custo) => eventosIds.includes(custo.eventoId))
        .reduce((acc, custo) => acc + custo.valor, 0);

      const totalCustosFixos = custosFixos.reduce(
        (acc, custo) => acc + custo.valor,
        0
      );

      const notasMes = notas.filter((nota) => {
        const evento = eventos.find((e) => e.id === nota.eventoId);
        if (!evento) return false;
        const eventoData = parseLocalDate(evento.data);
        const eventoMes = `${eventoData.getFullYear()}-${String(eventoData.getMonth() + 1).padStart(2, "0")}`;
        return eventoMes === mes;
      });

      const impostos = notasMes.reduce(
        (acc, nota) => acc + nota.valorImposto,
        0
      );

      const lucro = faturamento - custosVariaveis - totalCustosFixos - impostos;

      dadosLinha.push({
        mes: mesLabel,
        faturamento,
        lucro,
      });

      dadosBarras.push({
        mes: mesLabel,
        custosFixos: totalCustosFixos,
        custosVariaveis,
      });
    }

    return { dadosLinha, dadosBarras };
  }, []);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
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

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Resumo Financeiro
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho financeiro do seu buffet
            </p>
          </div>

          {/* Filtro de Período */}
          <FiltroPeriodo
            mesReferencia={mesReferencia}
            onMesChange={setMesReferencia}
          />
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResumoFinanceiroCard
            titulo="Total de Eventos"
            valor={dadosMes.totalEventos}
            subtitulo="Eventos realizados"
            icon={Calendar}
          />

          <ResumoFinanceiroCard
            titulo="Faturamento Total"
            valor={formatarMoeda(dadosMes.faturamentoTotal)}
            subtitulo="Receita bruta"
            icon={DollarSign}
            tendencia={calcularTendencia(
              dadosMes.faturamentoTotal,
              dadosMesAnterior.faturamentoTotal
            )}
          />

          <ResumoFinanceiroCard
            titulo="Lucro Líquido"
            valor={formatarMoeda(dadosMes.lucroLiquido)}
            subtitulo="Após custos e impostos"
            icon={dadosMes.lucroLiquido >= 0 ? TrendingUp : TrendingDown}
            tendencia={calcularTendencia(
              dadosMes.lucroLiquido,
              dadosMesAnterior.lucroLiquido
            )}
          />

          <ResumoFinanceiroCard
            titulo="Margem de Lucro"
            valor={`${dadosMes.margemLucro.toFixed(1)}%`}
            subtitulo="Sobre faturamento"
            icon={Percent}
          />
        </div>

        {/* Cards de Custos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResumoFinanceiroCard
            titulo="Custos Variáveis"
            valor={formatarMoeda(dadosMes.custosVariaveis)}
            subtitulo="Custos por evento"
            icon={Receipt}
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

        {/* Gráficos */}
        <GraficoEvolucao
          dadosLinha={dadosGraficos.dadosLinha}
          dadosBarras={dadosGraficos.dadosBarras}
        />
      </div>
    </DashboardLayout>
  );
};

export default Financeiro;
