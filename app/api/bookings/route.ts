import { NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getService, services } from "@/lib/services";

const serviceIds = services.map((service) => service.id) as [string, ...string[]];

const createBookingSchema = z.object({
  serviceId: z.enum(serviceIds),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  startsAt: z.iso.datetime({ offset: true }),
  notes: z.string().trim().max(1000).optional(),
});

const SLOT_TAKEN = {
  error: "That time has just been requested by someone else. Please pick another.",
};

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { serviceId, name, email, phone, notes } = parsed.data;
  const service = getService(serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown service." }, { status: 404 });
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (startsAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Please choose a time in the future." }, { status: 400 });
  }

  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const overlapping = await tx.bookingRequest.findFirst({
          where: {
            status: { in: ["NEW", "CONFIRMED"] },
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
          },
          select: { id: true },
        });

        if (overlapping) {
          return null;
        }

        return tx.bookingRequest.create({
          data: { serviceId, name, email, phone, startsAt, endsAt, notes },
          select: { id: true, serviceId: true, startsAt: true, endsAt: true, status: true },
        });
      },
      { isolationLevel: "Serializable" },
    );

    if (!booking) {
      return NextResponse.json(SLOT_TAKEN, { status: 409 });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: unique (serviceId, startsAt) violation. P2034: serializable conflict.
      if (error.code === "P2002" || error.code === "P2034") {
        return NextResponse.json(SLOT_TAKEN, { status: 409 });
      }
    }

    console.error("POST /api/bookings failed", error);
    return NextResponse.json(
      { error: "Could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}
