FROM node:20-alpine AS base

# 1. Build
FROM base AS builder
RUN apk add --no-cache libc6-compat git python3 make g++
WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps

# Use the hoisted nest binary directly instead of broken workspace bin script
WORKDIR /app/aqa-backend-nestjs
RUN /app/node_modules/.bin/nest build

# 2. Final image
FROM base AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules (full) and built output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/aqa-backend-nestjs ./aqa-backend-nestjs

WORKDIR /app/aqa-backend-nestjs
CMD ["node", "dist/main"]
