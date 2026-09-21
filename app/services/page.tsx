import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { formatDuration, formatPrice, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services — SlotSync",
  description: "The sessions you can book with SlotSync, with durations and pricing.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Services</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every session is run one-to-one. If none of these are quite right, mention it in the notes
        when you request a time and we will sort something out.
      </p>

      <ul className="mt-12 divide-y border-y">
        {services.map((service) => (
          <li key={service.id} className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start">
            <div className="flex-1">
              <h2 className="font-heading text-xl font-semibold">{service.name}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
            <div className="sm:w-48 sm:text-right">
              <p className="font-medium">{formatPrice(service.priceCents)}</p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(service.durationMinutes)}
              </p>
              <Link
                href={`/book?service=${service.id}`}
                className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3" })}
              >
                Request this
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
