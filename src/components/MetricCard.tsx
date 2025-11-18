import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, className }: MetricCardProps) => {
  return (
    <div className={cn("metric-card hover-scale", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium flex items-center gap-1",
            trend.isPositive ? "text-green-100" : "text-red-100"
          )}>
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl sm:text-4xl font-display font-bold mb-1">{value}</p>
        {subtitle && (
          <p className="text-white/70 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;