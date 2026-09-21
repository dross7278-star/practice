import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  startsAt: z.iso.datetime({ offset: true }),
  notes: z.string().max(1000).optional(),
});

const SLOT_TAKEN = { error: "This time slot is no longer available." } as const;

class SlotTakenError extends Error {}
class InvalidServiceError extends Error {}

export async function POST(request: Request) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking payload.", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { serviceId, notes } = parsed.data;
  const startsAt = new Date(parsed.data.startsAt);

  if (startsAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Bookings must start in the future." }, { status: 400 });
  }

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const service = await tx.service.findUnique({
          where: { id: serviceId },
          select: { id: true, providerId: true, durationMinutes: true, isActive: true },
        });

        if (!service || !service.isActive) {
          throw new InvalidServiceError();
        }

        const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

        // Overlap check across the whole provider calendar; the unique constraint below
        // is what actually makes the exact-slot case race-proof.
        const overlapping = await tx.booking.findFirst({
          where: {
            providerId: service.providerId,
            status: { in: ["PENDING", "CONFIRMED"] },
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
          },
          select: { id: true },
        });

        if (overlapping) {
          throw new SlotTakenError();
        }

        return tx.booking.create({
          data: {
            serviceId: service.id,
            providerId: service.providerId,
            clientId,
            startsAt,
            endsAt,
            notes,
          },
        });
      },
      { isolationLevel: "Serializable" },
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json(SLOT_TAKEN, { status: 409 });
    }

    if (error instanceof InvalidServiceError) {
      return NextResponse.json({ error: "Service not found or inactive." }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: (serviceId, startsAt) unique violation — another request won the race.
      if (error.code === "P2002") {
        return NextResponse.json(SLOT_TAKEN, { status: 409 });
      }
      // P2034: serializable transaction conflict, safe for the client to retry.
      if (error.code === "P2034") {
        return NextResponse.json(SLOT_TAKEN, { status: 409 });
      }
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Unknown service." }, { status: 400 });
      }
    }

    console.error("POST /api/bookings failed", error);
    return NextResponse.json({ error: "Could not create booking." }, { status: 500 });
  }
}
