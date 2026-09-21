export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
};

export const services: Service[] = [
  {
    id: "new-patient",
    name: "New Patient Consultation",
    description:
      "A longer first appointment to review your history, discuss any concerns, and agree on a plan of care together.",
    durationMinutes: 45,
    priceCents: 12000,
  },
  {
    id: "follow-up",
    name: "Follow-Up Visit",
    description:
      "A focused check-in to review how treatment is going, adjust medication, and answer anything that has come up since.",
    durationMinutes: 20,
    priceCents: 7500,
  },
  {
    id: "annual-physical",
    name: "Annual Physical",
    description:
      "A full yearly examination including screenings and bloodwork, with results and recommendations sent afterwards.",
    durationMinutes: 60,
    priceCents: 18000,
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
