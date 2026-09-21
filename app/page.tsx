import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { formatDuration, formatPrice, services } from "@/lib/services";

export default function HomePage() {
  return (
    <>
      <section className="hero-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-24 text-center">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            Find a time that actually works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            No accounts, no back-and-forth email threads. Pick the session you need, tell us when
            suits you, and we will confirm by email.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/book" className={buttonVariants({ size: "lg" })}>
              Request a time
            </Link>
            <Link href="/services" className={buttonVariants({ size: "lg", variant: "outline" })}>
              See what we offer
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Popular sessions</h2>
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
            { title: "Choose a session", body: "Each one lists how long it runs and what it costs." },
            { title: "Send your times", body: "Tell us the slot you want and anything we should know." },
            { title: "Get confirmation", body: "We reply by email, usually within one business day." },
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
