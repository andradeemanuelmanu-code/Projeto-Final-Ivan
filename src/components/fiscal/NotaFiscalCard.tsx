import { NotaFiscal } from "@/types/notaFiscal";
import { Evento } from "@/types/evento";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Calendar, User, DollarSign, TrendingUp, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";

interface NotaFiscalCardProps {
  nota: NotaFiscal;
  evento: Evento;
  onEditStatus: (nota: NotaFiscal) => void;
}

const tipoNotaLabels: Record<string, string> = {
  nfe: "NF-e",
  rps: "RPS",
  outro: "Outro",
};

const tipoImpostoLabels: Record<string, string> = {
  iss: "ISS",
  "simples-nacional": "Simples Nacional",
  outro: "Outro",
};

export function NotaFiscalCard({ nota, evento, onEditStatus }: NotaFiscalCardProps) {
  const getStatusColor = () => {
    if (nota.situacaoNota === "nao-emitida" || nota.situacaoImposto === "pendente") {
      return "bg-red-500";
    }
    if (nota.situacaoNota === "aguardando") {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  const getStatusLabel = () => {
    if (nota.situacaoNota === "nao-emitida") return "Nota não emitida";
    if (nota.situacaoNota === "aguardando") return "Aguardando emissão";
    if (nota.situacaoImposto === "pendente") return "Imposto pendente";
    return "Nota emitida - Pago";
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor()}`} />
      
      <CardContent className="p-6 pl-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">{evento.motivo}</h3>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{evento.cliente.nome}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(parseLocalDate(evento.data), "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={nota.situacaoNota === "emitida" && nota.situacaoImposto === "pago" ? "default" : "destructive"}>
              {getStatusLabel()}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditStatus(nota)}>
                  Alterar Situação do Imposto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tipo de Nota</p>
            <p className="font-medium text-sm">{tipoNotaLabels[nota.tipoNota]}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Valor Tributável</p>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-primary" />
              <p className="font-medium text-sm">
                {nota.valorTributavel.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Imposto ({tipoImpostoLabels[nota.tipoImposto]})</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <p className="font-medium text-sm text-accent">
                {nota.valorImposto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Situação Imposto</p>
            <Badge variant={nota.situacaoImposto === "pago" ? "outline" : "secondary"}>
              {nota.situacaoImposto === "pago" ? "Pago" : "Pendente"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}