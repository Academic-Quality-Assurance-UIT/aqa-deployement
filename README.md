# AQA-Deployement Monorepo

Welcome to the **Academic Quality Assurance (AQA)** monorepo. This repository manages the backend, frontend, and data scraping services for the AQA project.

---

## Quick Start

### 1. Requirements
- **Docker & Docker Compose**
- **pnpm** (version 9.x+)

### 2. Run Locally
Build and start the full stack:
```bash
pnpm install
pnpm turbo dev
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/graphql`

---

## Documentation Index

Explore the detailed documentation in the [`docs/`](./docs) folder:

| Guide | Description |
|-------|-------------|
| 🏰 [**Architecture**](./docs/architecture.md) | System overview, tech stack, and monorepo structure. |
| 🚀 [**Deployment**](./docs/deployment.md) | How to deploy manually or with Docker Compose. |
| 🛡️ [**CI/CD**](./docs/ci-cd.md) | GitHub Actions pipelines and OpenVPN setup. |
| 💾 [**Database**](./docs/database.md) | Schema details, entities, and data management. |

---

## Core Packages

- **`@aqa/client`**: Next.js 14 frontend.
- **`@aqa/backend`**: NestJS GraphQL backend.
- **`@aqa/crawl-data`**: Data fetching and processing scripts.
- **`@aqa/llm`**: AI/LLM integration logic.

---

## CI/CD and Deployment Status

Continuous Integration is handled via GitHub Actions:
- **CI**: Linting, testing, and building on every push to `main` and `dev`.
- **Deploy**: Automated deployment to the VPS behind UIT-VPN on every push to `main`.

---

## Licenses

This project is licensed under **UNLICENSED** (refer to `aqa-backend-nestjs/package.json`).
Individual components may vary.
