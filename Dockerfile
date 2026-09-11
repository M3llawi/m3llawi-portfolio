FROM node:22-bookworm-slim AS base

# ---- deps (full, incl. devDependencies needed for the build) ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- production-only deps (for the runtime image) ----
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Only needed so payload.config.ts can load during the build — no DB
# connection or real secret is required at build time, just non-empty values.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV PAYLOAD_SECRET="build-time-placeholder-not-used-at-runtime"
ENV NEXT_PUBLIC_SERVER_URL="https://m3llawi.com"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run generate:types
RUN npm run build

# ---- runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# The full src/ tree (not just the compiled .next output) is needed at
# runtime because `payload migrate` loads payload.config.ts — and everything
# it imports — directly as TypeScript, outside the Next.js build pipeline.
COPY --from=builder /app/src ./src
COPY package.json next.config.ts tsconfig.json next-env.d.ts ./

# Persisted media uploads — mount a volume at /app/media in production.
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]
