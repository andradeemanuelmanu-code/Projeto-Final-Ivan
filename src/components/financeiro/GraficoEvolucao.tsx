import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GraficoEvolucaoProps {
  dadosLinha: Array<{
    mes: string;
    faturamento: number;
    lucro: number;
  }>;
  dadosBarras: Array<{
    mes: string;
    custosFixos: number;
    custosVariaveis: number;
  }>;
}

export function GraficoEvolucao({ dadosLinha, dadosBarras }: GraficoEvolucaoProps) {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Evolução de Faturamento e Lucro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Evolução Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosLinha}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
                tickFormatter={formatarMoeda}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => formatarMoeda(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="faturamento"
                stroke="#8B7355"
                strokeWidth={2}
                name="Faturamento"
                dot={{ fill: "#8B7355", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="#5CB85C"
                strokeWidth={2}
                name="Lucro Líquido"
                dot={{ fill: "#5CB85C", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Custos Fixos vs Variáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Custos Fixos vs Variáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
                tickFormatter={formatarMoeda}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => formatarMoeda(value)}
              />
              <Legend />
              <Bar
                dataKey="custosFixos"
                fill="#C44536"
                name="Custos Fixos"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="custosVariaveis"
                fill="#F0AD4E"
                name="Custos Variáveis"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
