import { Evento } from "@/types/evento";
import { custosStorage } from "@/lib/custosStorage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExecutedEventsListProps {
  eventos: Evento[];
}

export function ExecutedEventsList({ eventos }: ExecutedEventsListProps) {
  const eventosExecutados = eventos.filter(
    (evento) => parseLocalDate(evento.data) < new Date()
  );

  if (eventosExecutados.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum evento executado encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-display font-semibold">Motivo do Evento</TableHead>
            <TableHead className="font-display font-semibold">Cliente</TableHead>
            <TableHead className="font-display font-semibold">Data</TableHead>
            <TableHead className="font-display font-semibold text-right">Total de Gastos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventosExecutados.map((evento) => {
            const totalGastos = custosStorage.getTotalByEventoId(evento.id);
            return (
              <TableRow key={evento.id}>
                <TableCell className="font-medium">{evento.motivo}</TableCell>
                <TableCell>{evento.cliente.nome}</TableCell>
                <TableCell>
                  {format(parseLocalDate(evento.data), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {totalGastos > 0 ? (
                    <span className="text-[hsl(var(--status-paid))]">
                      R$ {totalGastos.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
