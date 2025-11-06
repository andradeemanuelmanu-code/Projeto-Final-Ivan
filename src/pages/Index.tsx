import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import EventCard from "@/components/EventCard";
import CalendarWidget from "@/components/CalendarWidget";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { mockEvents, mockMetrics } from "@/lib/mockData";

const Index = () => {
  const metricIcons = [Calendar, DollarSign, TrendingUp, Users];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockMetrics.map((metric, index) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metricIcons[index]}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Events and Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-xl">Próximos Eventos</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="lg:col-span-1">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
