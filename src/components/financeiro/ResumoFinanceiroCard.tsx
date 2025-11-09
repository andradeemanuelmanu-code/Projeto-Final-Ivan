import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumoFinanceiroCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icon: LucideIcon;
  tendencia?: {
    valor: string;
    positiva: boolean;
  };
  className?: string;
}

export function ResumoFinanceiroCard({
  titulo,
  valor,
  subtitulo,
  icon: Icon,
  tendencia,
  className,
}: ResumoFinanceiroCardProps) {
  return (
    <Card className={cn("hover:scale-105 transition-transform duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display font-bold text-foreground mb-1">
          {valor}
        </div>
        {subtitulo && (
          <p className="text-xs text-muted-foreground mb-2">{subtitulo}</p>
        )}
        {tendencia && (
          <div
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              tendencia.positiva ? "text-green-600" : "text-red-600"
            )}
          >
            {tendencia.positiva ? "↑" : "↓"} {tendencia.valor}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
