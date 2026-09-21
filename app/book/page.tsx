import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Book — SlotSync",
  description: "Request an appointment time and we will confirm by email.",
};

export default function BookPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Request a time
      </h1>
      <p className="mt-4 text-muted-foreground">
        Tell us which appointment you need and when suits you. Times are read in your own time zone.
      </p>

      <Suspense fallback={null}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
