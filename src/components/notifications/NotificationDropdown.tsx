"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { eventosStorage } from "@/lib/eventosStorage";
import { Evento } from "@/types/evento";
import { parseLocalDate } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Evento[]>([]);

  useEffect(() => {
    const allEvents = eventosStorage.getAllSorted();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingNotifications = allEvents.filter(event => 
      event.statusPagamento === 'pending' && parseLocalDate(event.data) >= today
    );

    setNotifications(pendingNotifications);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="p-4">
          <h3 className="font-semibold text-lg">Pagamentos Pendentes</h3>
          <p className="text-sm text-muted-foreground">
            {notifications.length > 0 
              ? `Você tem ${notifications.length} pagamento${notifications.length > 1 ? 's' : ''} pendente${notifications.length > 1 ? 's' : ''}.`
              : "Nenhuma pendência no momento."}
          </p>
        </div>
        <Separator />
        {notifications.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(evento => (
              <Link
                key={evento.id}
                to="/eventos"
                className="block p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{evento.motivo}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(parseLocalDate(evento.data), { locale: ptBR, addSuffix: true })}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {evento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Todos os pagamentos estão em dia!</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};