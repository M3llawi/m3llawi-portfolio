import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Applied everywhere, including /admin — safe, non-breaking hardening.
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Only on public frontend routes: Payload's admin bundle (Monaco editor, web
// workers) is heavy enough that a strict CSP there needs its own careful,
// separately-tested policy — not something to bolt on as a side effect here.
const frontendCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: baseSecurityHeaders },
      {
        source: "/((?!admin|api).*)",
        headers: [{ key: "Content-Security-Policy", value: frontendCsp }],
      },
    ];
  },
};

export default withPayload(nextConfig);
