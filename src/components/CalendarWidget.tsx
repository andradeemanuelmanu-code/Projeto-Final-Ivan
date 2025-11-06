import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const CalendarWidget = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock events for specific dates
  const eventDates = [
    new Date(2025, 10, 15),
    new Date(2025, 10, 20),
    new Date(2025, 10, 25),
  ];

  return (
    <Card className="p-6">
      <h3 className="font-display font-semibold text-lg mb-4">Calendário de Eventos</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg"
        modifiers={{
          hasEvent: eventDates
        }}
        modifiersStyles={{
          hasEvent: {
            fontWeight: "bold",
            color: "hsl(var(--accent))"
          }
        }}
      />
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {eventDates.length} eventos agendados este mês
        </p>
      </div>
    </Card>
  );
};

export default CalendarWidget;
