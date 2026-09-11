import { NextResponse, type NextRequest } from "next/server";

// In-memory fixed-window limiter. Holds state for the life of the Node
// process this app runs in — correct for a single-instance deployment
// (e.g. one container on a VPS); would need a shared store (Redis, etc.)
// if ever scaled to multiple instances.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function sweepExpired(now: number) {
  // Cheap, occasional cleanup so the map doesn't grow unbounded over uptime.
  if (Math.random() > 0.01) return;
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}

export function middleware(request: NextRequest) {
  if (request.method !== "POST") return NextResponse.next();

  const now = Date.now();
  sweepExpired(now);

  const ip = getClientIp(request);
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { errors: [{ message: "Too many requests. Please try again later." }] },
      { status: 429 },
    );
  }

  entry.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: "/api/messages",
};
