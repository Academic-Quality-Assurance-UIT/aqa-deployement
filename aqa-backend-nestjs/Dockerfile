FROM node:20-alpine AS base

# 1. Build
FROM base AS builder
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

COPY . .
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
RUN pnpm install

# Use pnpm to build the application
WORKDIR /app/aqa-backend-nestjs
RUN pnpm build

# 2. Final image
FROM base AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for pnpm install
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/aqa-backend-nestjs/package.json ./aqa-backend-nestjs/

# Install production dependencies
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
RUN pnpm install --prod --frozen-lockfile

# Copy built output
COPY --from=builder /app/aqa-backend-nestjs/dist ./aqa-backend-nestjs/dist

WORKDIR /app/aqa-backend-nestjs
CMD ["node", "dist/main"]
