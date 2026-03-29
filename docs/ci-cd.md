# CI/CD Guide

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment.

## Workflows

### 1. CI Workflow (`ci.yml`)
- **Trigger**: Push or Pull Request to `main` or `dev` branches.
- **Goal**: Ensure code quality and build integrity.
- **Steps**:
  1. Setup `pnpm` and `Node.js`.
  2. Install dependencies (`pnpm install`).
  3. Run Linting (`pnpm turbo lint`).
  4. Run Tests (`pnpm turbo test`).
  5. Run Build (`pnpm turbo build`).

### 2. Deploy Workflow (`deploy.yml`)
- **Trigger**: Push to `main` branch.
- **Goal**: Automate deployment to the VPS.
- **Steps**:
  1. **Detect Changes**: Identifies which applications (`@aqa/backend` or `@aqa/client`) have changed.
  2. **Build & Push**: Builds Docker images for the changed apps and pushes them to Docker Hub.
  3. **OpenVPN Connection**: Connects to the UIT VPN to reach the VPS.
  4. **SSH Deploy**: Connects to the VPS via SSH, pulls new images, and restarts containers using Docker Compose.

---

## Required GitHub Secrets

To enable the workflows, you must configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

### Docker Hub
- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (not password).

### VPN (OpenVPN)
- `OVPN_CA_CERT`: The content of your CA certificate file (`SV_pfSense4-UDP4-1195-config-ca.pem`).
- `VPN_USERNAME`: Your VPN login username (e.g., `21520946`).
- `VPN_PASSWORD`: Your VPN login password.

### Deployment (SSH)
- `SSH_HOST`: The internal IP address of your VPS on the VPN (e.g., `10.x.x.x`).
- `SSH_USERNAME`: The SSH username for your VPS (e.g., `ubuntu`).
- `SSH_KEY`: Your SSH private key (PEM format).

### Application Environment (Shared/Build)
- `NEXT_PUBLIC_API_URL_V2`: The public URL of the backend GraphQL endpoint (e.g., `/api` or `https://aqa.uit.edu.vn/api`).
- `BACKEND_URL`: Internal/External GraphQL URL (e.g., `http://backend:8000/graphql`).
- `SECRET_KEY`: Used for JWT signing (e.g., `nvLYLiqoGM...`).

### Backend Specific (`@aqa/backend`)
These should be defined on the VPS in the root `.env` or as environment variables for the `backend` service:

| Variable | Description | Default/Example |
|----------|-------------|-----------------|
| `DB_TYPE` | Type of database | `postgres` |
| `DB_HOST` | Database host | `postgres` (docker) |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | DB User | `postgres` |
| `DB_PASSWORD` | DB Pass | `jnhbgvfc` |
| `DB_DATABASE` | DB Name | `aqa` |
| `LLM_MODEL` | AI model name | `chart-generating` |
| `OPENAI_API` | AI base URL | `http://llm:11435/v1/` |

### Client Specific (`@aqa/client`)
These are used during building or running the Next.js application:

| Variable | Description | Default/Example |
|----------|-------------|-----------------|
| `MODEL_API` | External API for AI | `https://...ngrok-free.app/api/generate` |
| `HOST_NAME` | Binding address | `0.0.0.0` |
| `NEXT_PUBLIC_API_URL_V2` | UI API URL | `/api` |


---

## Connecting Behind VPN

The deployment workflow uses **OpenVPN** to tunnel into the UIT network. It automatically:
1. Installs the `openvpn` client.
2. Writes the CA cert and credentials to temporary files.
3. Establish a connection to `vpn.uit.edu.vn:1195`.
4. Executes the SSH commands once the `tun0` interface is ready.
5. Cleans up and disconnects after the deployment.
