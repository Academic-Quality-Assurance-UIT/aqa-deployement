FROM node:22-alpine AS base

# 1. Build
FROM base AS builder
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

COPY . .
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
RUN pnpm install

# Environment variables for build time
ARG NEXT_PUBLIC_API_URL_V2
ENV NEXT_PUBLIC_API_URL_V2=$NEXT_PUBLIC_API_URL_V2
ARG BACKEND_URL=http://host.docker.internal:8000/graphql
ENV BACKEND_URL=$BACKEND_URL
ARG BACKEND_API_URL=http://host.docker.internal:8000
ENV BACKEND_API_URL=$BACKEND_API_URL

# Use pnpm to build the application
WORKDIR /app/aqa-client
RUN pnpm build

# 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/aqa-client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/aqa-client/.next/static ./aqa-client/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/aqa-client/public ./aqa-client/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "aqa-client/server.js"]
