# Deployment Guide

This guide outlines the steps for deploying the AQA (Academic Quality Assurance) project to your server.

---

## Prerequisites

- **Docker & Docker Compose**: Installed on the VPS.
- **VPN**: Access to the UIT Network if deploying behind a firewall.
- **Node.js & pnpm**: Required only for local development and build testing.
- **OpenVPN Client**: Required for connecting to the VPS from external networks.

---

## Deployment Strategies

### 1. Automated Deployment (GitHub Actions)
The most common way to deploy is via pushing code to the `main` branch. See the [CI/CD Guide](./ci-cd.md) for detailed setup.

### 2. Manual Deployment (On VPS)

If you are already on the VPS, you can deploy manually using Docker Compose.

#### A. Initial Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Academic-Quality-Assurance-UIT/aqa-deployement.git /opt/aqa-deployment
   cd /opt/aqa-deployment
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   nano .env # Fill in the required values
   ```

#### B. Running the Stack
The monorepo-friendly `docker-compose.yml` builds images from source:
```bash
docker compose up -d --build
```

#### C. Updating the Application
To pull changes and rebuild specific services:
```bash
git pull
docker compose build frontend backend
docker compose up -d --no-deps frontend backend
docker image prune -f
```

---

## Environment Configuration

Both the frontend and backend utilize a central `.env` file at the root.

| Key | Description |
|-----|-------------|
| `DB_HOST` | Database host (e.g., `postgres` for Docker, `localhost` for local) |
| `DB_PORT` | Database port (default `5432`) |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_DATABASE` | Target database name |
| `NEXT_PUBLIC_API_URL_V2` | Public backend GraphQL endpoint |
| `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` | Google Cloud/Ollama/OpenAI API credentials |

---

## Local Development Deployment
To run the full stack locally for testing:
1. Install dependencies: `pnpm install`
2. Run all services: `pnpm turbo dev`
3. Access the dashboard: `http://localhost:3000`
4. Access the API: `http://localhost:8000/graphql`
