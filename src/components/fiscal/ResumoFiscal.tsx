import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, DollarSign, AlertCircle, TrendingUp } from "lucide-react";

interface ResumoFiscalProps {
  totalEmitidas: number;
  totalImpostosPagos: number;
  totalImpostosPendentes: number;
  percentualMedio: number;
}

export function ResumoFiscal({ 
  totalEmitidas, 
  totalImpostosPagos, 
  totalImpostosPendentes, 
  percentualMedio 
}: ResumoFiscalProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notas Emitidas</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmitidas}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de notas fiscais</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impostos Pagos</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {totalImpostosPagos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Impostos quitados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impostos Pendentes</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {totalImpostosPendentes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Aguardando pagamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tributação Média</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{percentualMedio.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Percentual médio</p>
        </CardContent>
      </Card>
    </div>
  );
}
