export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
};

export const services: Service[] = [
  {
    id: "consultation",
    name: "Discovery Consultation",
    description:
      "A relaxed first conversation to understand what you need, talk through options, and map out next steps.",
    durationMinutes: 30,
    priceCents: 0,
  },
  {
    id: "strategy-session",
    name: "Strategy Session",
    description:
      "A focused working block where we dig into a single problem and leave with a concrete plan you can act on.",
    durationMinutes: 60,
    priceCents: 15000,
  },
  {
    id: "deep-dive",
    name: "Half-Day Deep Dive",
    description:
      "An extended session for larger projects, including a written summary and recommendations afterwards.",
    durationMinutes: 240,
    priceCents: 55000,
  },
];

export function getService(id: string) {
  return services.find((service) => service.id === id);
}

export function formatPrice(priceCents: number) {
  if (priceCents === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function formatDuration(durationMinutes: number) {
  if (durationMinutes < 60) return `${durationMinutes} min`;
  const hours = durationMinutes / 60;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}
