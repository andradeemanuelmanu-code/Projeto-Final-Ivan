import { EventStatus } from "@/components/EventCard";

export interface Event {
  id: string;
  title: string;
  client: string;
  date: string;
  location: string;
  guests: number;
  value: string;
  status: EventStatus;
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Casamento Silva & Costa",
    client: "Maria Silva",
    date: "15/11/2025",
    location: "Espaço Garden, São Paulo",
    guests: 200,
    value: "45.000",
    status: "paid"
  },
  {
    id: "2",
    title: "Aniversário Corporativo Tech Corp",
    client: "Tech Corp LTDA",
    date: "20/11/2025",
    location: "Hotel Plaza, São Paulo",
    guests: 150,
    value: "28.500",
    status: "pending"
  },
  {
    id: "3",
    title: "Formatura Medicina 2025",
    client: "Turma Medicina USP",
    date: "25/11/2025",
    location: "Clube Atlético, São Paulo",
    guests: 300,
    value: "62.000",
    status: "quote"
  },
  {
    id: "4",
    title: "Coquetel de Lançamento",
    client: "Imobiliária Prime",
    date: "28/11/2025",
    location: "Rooftop Sky, São Paulo",
    guests: 80,
    value: "15.200",
    status: "paid"
  }
];

export interface MetricData {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const mockMetrics: MetricData[] = [
  {
    title: "Eventos Este Mês",
    value: 12,
    subtitle: "4 novos esta semana",
    trend: { value: "15%", isPositive: true }
  },
  {
    title: "Receita Total",
    value: "R$ 185.200",
    subtitle: "Últimos 30 dias",
    trend: { value: "8%", isPositive: true }
  },
  {
    title: "Taxa de Conversão",
    value: "68%",
    subtitle: "Orçamentos → Contratos",
    trend: { value: "3%", isPositive: false }
  },
  {
    title: "Média de Convidados",
    value: 158,
    subtitle: "Por evento",
    trend: { value: "12%", isPositive: true }
  }
];
