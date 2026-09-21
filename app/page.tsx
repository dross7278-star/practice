import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { formatDuration, formatPrice, services } from "@/lib/services";

export default function HomePage() {
  return (
    <>
      <section className="hero-surface">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold tracking-widest text-red-700 uppercase">
              Book your appointment
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
              Care that fits your schedule
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
              No phone queues, no waiting on hold. Choose the appointment you need, tell us when
              suits you, and our team will confirm by email.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/book" className={buttonVariants({ size: "lg" })}>
                Request a time
              </Link>
              <Link href="/services" className={buttonVariants({ size: "lg", variant: "outline" })}>
                See our appointments
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-xl border shadow-sm">
            <Image
              src="/hero.jpg"
              alt="A doctor and a patient talking and smiling during an appointment"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Appointment types</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="rounded-xl border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold">{service.name}</h3>
                <p className="mt-1 text-sm font-medium text-red-700">
                  {formatDuration(service.durationMinutes)} &middot; {formatPrice(service.priceCents)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            { title: "Choose an appointment", body: "Each one lists how long it runs and what it costs." },
            { title: "Send your times", body: "Tell us the slot you want and anything we should know." },
            { title: "Get confirmation", body: "Our team replies by email, usually within one business day." },
          ].map((step, index) => (
            <li key={step.title}>
              <span className="font-heading text-3xl text-red-700">{index + 1}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
