# Technology Stack

The AQA (Academic Quality Assurance) system is built with a modern, full-stack web architecture designed for scalable academic data management and analysis.

---

## Frontend: Next.js Client

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18.2** - UI library
- **TypeScript 5.1.6** - Type-safe development

### Styling & UI
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **@heroui/react 2.7.6** - Component library (NextUI/HeroUI)
- **@emotion/react & @emotion/styled** - CSS-in-JS solutions
- **PostCSS 8.4.27** - CSS transformation

### State Management
- **Zustand 4.5.5** - Lightweight state management
- **SWR 2.2.5** - Data fetching and caching
- **React Query 3.39.3** - Server-state synchronization

### Data Fetching & API
- **Apollo Client 3.11.5** - GraphQL client
- **GraphQL 16.9.0** - Query language

### UI Components & Libraries
- **@tremor/react 3.18.2** - Dashboard components
- **Chart.js 4.4.4** - Charting (with react-chartjs-2)
- **Recharts 2.12.7** - React chart components
- **React-icons 5.3.0** - Icon collection
- **framer-motion 10.18.0** - Animation

### File Processing & Utilities
- **read-excel-file 5.8.8** & **xlsx 0.18.5** - Excel processing
- **dom-to-image 2.6.0** - Screenshot generation
- **dom-to-pdf 0.3.2** - PDF export
- **date-fns 4.1.0** & **moment 2.30.1** - Date handling

### Authentication
- **NextAuth.js 5.0.0-beta.20** - Auth framework
- **@auth/core 0.31.0** - Auth primitives

### Development Tools
- **ESLint 8.46.0** - Linting
- **TypeScript** - Type checking
- **GraphQL Codegen** - Client-side code generation

---

## Backend: NestJS Server

### Core Framework
- **NestJS 10.0+** - Progressive Node.js framework
- **TypeScript 5.1.3+** - Type-safe backend

### API Layer
- **Apollo Server 4.10.0** & **@nestjs/graphql 12.1.1** - GraphQL implementation
- **body-parser 1.20.2** - Request parsing

### Data Persistence
- **TypeORM 0.3.20** - ORM
- **PostgreSQL driver (pg) 8.11.3** - Database client

### Authentication & Security
- **Passport.js** with:
  - JWT strategy for token-based auth
  - Local strategy for username/password
- **bcrypt 5.1.1** - Password hashing
- **@nestjs/jwt 10.2.0** - JWT utilities
- **@nestjs/passport 10.0.3** - Passport integration

### Email Services
- **Nodemailer 6.9.14** - Email sending

### AI & Integration
- **Ollama 0.5.17** - Local LLM client
- **OpenAI 5.16.0** - Cloud AI integration
- **@google-cloud/local-auth 3.0.1** - OAuth2 authentication
- **googleapis 142.0.0** - G Suite APIs

### Utilities
- **@nestjs/config** - Environment configuration
- **uuid 13.0.0** - Unique identifiers
- **axios 1.10.0** - HTTP client

### Testing & DevTools
- **Jest 29.5.0** - Testing framework
- **ts-jest 29.1.0** - TypeScript support
- **@nestjs/testing 10.0.0** - NestJS testing
- **Supertest 6.3.3** - HTTP testing

---

## Data Layer

### Primary Database
- **PostgreSQL** - Relational database for all persistent data

### Cache & Sessions
- **Redis (Alpine)** - In-memory cache for sessions and rate limiting

---

## Infrastructure & Deployment

### Containerization
- **Docker Compose** orchestrates:
  - Frontend (aqa-client)
  - Backend (aqa-backend-nestjs)
  - Redis cache
- Custom Dockerfiles for production builds

### Development Setup
- **Turborepo monorepo** with pnpm workspaces
- Path aliases:
  - `@/*` → `./src/`
  - `@components/*` → `./src/components/`
  - `@contexts/*` → `./src/contexts/`
  - `@assets/*` → `./src/assets/`

---

## Schema & GraphQL

**17+ GraphQL schemas** covering all domains:
- user, lecturer, subject, semester, faculty, program
- criteria, comment, additional-comment
- staff-survey, classes, points tracking

All generated via **GraphQL Codegen** with Apollo Client preset.

---

## Design System

### Typography
- **Montserrat** (Google Fonts) - 300 to 800 weights

### Color System
- Component-based Tailwind utilities
- Custom CSS variables for consistent theming

