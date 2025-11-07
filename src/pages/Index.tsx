import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { mockMetrics } from "@/lib/mockData";

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

        {/* Agenda de Eventos */}
        <AgendaCalendar />
      </div>
    </DashboardLayout>
  );
};

export default Index;
