import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoricoMesesProps {
  historico: Array<{
    mes: string;
    total: number;
    quantidade: number;
  }>;
}

const mesesNomes: Record<string, string> = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

export const HistoricoMeses = ({ historico }: HistoricoMesesProps) => {
  if (historico.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Histórico dos Últimos Meses
        </h3>
        <p className="text-muted-foreground text-center py-8">
          Nenhum histórico disponível ainda.
        </p>
      </div>
    );
  }

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Histórico dos Últimos Meses
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {historico.map((item, index) => {
          const [ano, mes] = item.mes.split("-");
          const mesNome = mesesNomes[mes] || mes;
          
          const variacao = index < historico.length - 1
            ? calcularVariacao(item.total, historico[index + 1].total)
            : 0;

          const isPositivo = variacao > 0;
          const isNegativo = variacao < 0;
          const isNeutro = variacao === 0 || index === historico.length - 1;

          return (
            <div
              key={item.mes}
              className="bg-background border border-border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">
                  {mesNome} {ano}
                </h4>
                {!isNeutro && (
                  <div className={`flex items-center gap-1 text-sm ${
                    isPositivo ? "text-destructive" : "text-green-600"
                  }`}>
                    {isPositivo ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{Math.abs(variacao).toFixed(1)}%</span>
                  </div>
                )}
                {isNeutro && index < historico.length - 1 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Minus size={16} />
                    <span>0%</span>
                  </div>
                )}
              </div>
              
              <p className="text-2xl font-bold text-foreground">
                {item.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              
              <p className="text-sm text-muted-foreground">
                {item.quantidade} {item.quantidade === 1 ? "item registrado" : "itens registrados"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
