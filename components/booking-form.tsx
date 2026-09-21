"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatDuration, formatPrice, services } from "@/lib/services";

const fieldClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

type Status = { kind: "idle" | "sending" } | { kind: "error" | "success"; message: string };

export function BookingForm() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("service");
  const initialService = services.some((s) => s.id === requested) ? requested! : services[0].id;

  const [serviceId, setServiceId] = useState(initialService);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "sending" });

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const localDateTime = String(form.get("startsAt") ?? "");
    const parsedDate = new Date(localDateTime);

    if (!localDateTime || Number.isNaN(parsedDate.getTime())) {
      setStatus({ kind: "error", message: "Please choose a date and time." });
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          notes: form.get("notes") || undefined,
          startsAt: parsedDate.toISOString(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        kind: "success",
        message: "Thanks — your request is in. We will email you to confirm.",
      });
      formElement.reset();
    } catch {
      setStatus({ kind: "error", message: "Could not reach the server. Please try again." });
    }
  }

  const selected = services.find((service) => service.id === serviceId)!;

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="serviceId" className="text-sm font-medium">
          Session
        </label>
        <select
          id="serviceId"
          name="serviceId"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          className={fieldClass}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground">
          {formatDuration(selected.durationMinutes)} &middot; {formatPrice(selected.priceCents)}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required maxLength={120} className={fieldClass} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} className={fieldClass} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="startsAt" className="text-sm font-medium">
            Preferred start
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={4} maxLength={1000} className={fieldClass} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" isDisabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send request"}
        </Button>
        {(status.kind === "error" || status.kind === "success") && (
          <p
            role="status"
            className={status.kind === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
