# AGENTS.md

## Build, Lint, and Test Commands

### Monorepo Commands
```bash
pnpm install                    # Install all dependencies
pnpm turbo dev                  # Start all services in development mode
pnpm turbo build                # Build all packages
pnpm turbo lint                 # Lint all packages
pnpm turbo test                 # Run all tests
pnpm turbo format               # Format all packages
```

### Backend (NestJS) Commands
```bash
cd aqa-backend-nestjs
pnpm dev                        # Start development server with hot reload
pnpm build                      # Build the backend
pnpm start                      # Start production server
pnpm lint                       # Run ESLint with auto-fix
pnpm test                       # Run Jest tests
pnpm test:watch                 # Run tests in watch mode
pnpm test:cov                   # Run tests with coverage report
pnpm test:e2e                   # Run E2E tests
pnpm typeorm                   # Run TypeORM CLI
```

### Frontend (Next.js) Commands
```bash
cd aqa-client
pnpm dev                        # Start Next.js development server
pnpm build                      # Build Next.js application
pnpm start                      # Start production server
pnpm lint                       # Run ESLint
pnpm codegen                   # Generate GraphQL client code
```

### Data Crawler Commands
```bash
cd aqa-crawl-data
pnpm crawl                      # Run crawler
pnpm crawl-all                  # Run all crawlers
pnpm aggregate                  # Aggregate points
pnpm stats                      # Show statistics
pnpm transfer                   # Transfer data
pnpm test-db                    # Test database connections
```

### LLM Commands
```bash
cd aqa-llm
pnpm start                      # Start LLM service
pnpm get-dataset                # Get dataset for fine-tuning
pnpm convert-dataset            # Convert dataset format
```

### Running a Single Test
```bash
# For backend tests
cd aqa-backend-nestjs && pnpm test <test-file>

# For frontend tests
cd aqa-client && pnpm test <test-file>

# For specific test file
pnpm turbo test --filter=@aqa/backend -- --testPathPattern=<pattern>
pnpm turbo test --filter=@aqa/client -- --testPathPattern=<pattern>
```

## Code Style Guidelines

### General Principles
- Use TypeScript for all code
- Follow monorepo structure with scoped packages (@aqa/*)
- Use pnpm as package manager (version 9.x+)
- Leverage Turborepo for build orchestration

### Backend (NestJS) Style
**Formatting (Prettier):**
- Single quotes for strings
- Trailing commas on all lines
- Tab width: 2 spaces
- Use spaces, not tabs
- Print width: 80 characters

**Linting (ESLint):**
- Use `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Extend `plugin:@typescript-eslint/recommended` and `plugin:prettier/recommended`
- Disable explicit function return types and module boundary types
- Disable explicit any type (use `any` when necessary)
- Enable node and jest environments

**Naming Conventions:**
- Use PascalCase for classes and interfaces
- Use camelCase for functions, variables, and methods
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names for services, modules, and entities

**Error Handling:**
- Use NestJS built-in exception filters
- Implement proper error responses with HTTP status codes
- Log errors appropriately using NestJS Logger
- Use try-catch blocks for database operations

**Code Organization:**
- Organize code by feature modules
- Use dependency injection for services
- Implement DTOs for input validation
- Use guards for authorization
- Use interceptors for cross-cutting concerns

### Frontend (Next.js) Style
**Formatting (Prettier):**
- Tab width: 4 spaces
- Use tabs, not spaces
- Use semicolons
- Single quotes for strings
- Print width: 85 characters
- Trailing commas: es5
- Bracket spacing: true
- JSX single quotes: false
- Arrow parens: always
- End of line: lf

**Linting (ESLint):**
- Use `next/core-web-vitals` as base
- Follow Next.js best practices
- Use React 18.2+ patterns
- Implement proper error boundaries

**Naming Conventions:**
- Use PascalCase for components
- Use camelCase for functions, variables, and hooks
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names for components, hooks, and utilities

**Code Organization:**
- Use App Router structure (app directory)
- Organize components by feature or domain
- Use server components by default
- Use client components only when necessary
- Implement proper TypeScript types

**State Management:**
- Use Zustand for global state
- Use SWR for data fetching and caching
- Use React Query for server state
- Keep components pure and functional

**Styling:**
- Use Tailwind CSS for styling
- Use @heroui/react for UI components
- Use @emotion/react and @emotion/styled for CSS-in-JS
- Follow component-based design system
- Use consistent spacing and typography

**GraphQL Integration:**
- Use Apollo Client for GraphQL operations
- Generate types with GraphQL Codegen
- Use typed queries and mutations
- Implement proper error handling

### Database (TypeORM)
**Naming Conventions:**
- Use camelCase for entity properties
- Use snake_case for database columns
- Use PascalCase for entity names
- Implement proper relationships with decorators

**Error Handling:**
- Use TypeORM's built-in error handling
- Implement proper transaction management
- Use try-catch for database operations
- Handle connection errors appropriately

### Authentication & Security
**Backend:**
- Use JWT strategy for token-based authentication
- Use Passport for authentication middleware
- Hash passwords with bcrypt (salt rounds: 10)
- Implement proper authorization with guards
- Validate input data with DTOs
- Use environment variables for sensitive data

**Frontend:**
- Use NextAuth.js for authentication
- Store tokens securely in httpOnly cookies
- Implement proper error handling for auth failures
- Use protected routes with middleware

### API Design (GraphQL)
**Backend:**
- Use NestJS GraphQL decorators (@Query, @Mutation, @Resolver)
- Implement proper input types with @InputType
- Use @Field for GraphQL schema
- Implement proper error handling with GraphQL errors
- Use @UseGuards for authorization

**Frontend:**
- Use Apollo Client for GraphQL operations
- Generate types with GraphQL Codegen
- Use typed queries and mutations
- Implement proper error handling

### Testing
**Backend:**
- Use Jest for unit and integration tests
- Use @nestjs/testing for NestJS components
- Use Supertest for HTTP testing
- Mock external dependencies
- Test both success and error cases

**Frontend:**
- Use Jest for unit tests
- Use React Testing Library for component tests
- Test user interactions and state changes
- Mock API calls and external services

### Code Generation
**GraphQL Codegen:**
- Use `@graphql-codegen/cli` for code generation
- Use `@graphql-codegen/client-preset` for Apollo Client
- Use `@graphql-codegen/typescript-operations` for typed queries
- Use `@graphql-codegen/typescript-react-apollo` for React Apollo
- Run codegen with `pnpm codegen` command

### Environment Variables
**Backend:**
- Use `@nestjs/config` for configuration
- Store sensitive data in .env file
- Use environment variables for URLs and credentials
- Validate configuration at startup

**Frontend:**
- Use `NEXT_PUBLIC_` prefix for public variables
- Store private variables in .env.local
- Use environment variables for API URLs
- Never expose sensitive data in client-side code

### File Organization
**Backend:**
- `src/` - Main source directory
- `src/modules/` - Feature modules
- `src/common/` - Shared utilities
- `src/config/` - Configuration files
- `src/dto/` - Data transfer objects
- `src/entities/` - TypeORM entities
- `src/guards/` - Authorization guards
- `src/interceptors/` - Request/response interceptors
- `src/middleware/` - Express middleware
- `src/pipes/` - Validation pipes
- `src/resolvers/` - GraphQL resolvers
- `src/services/` - Business logic services
- `src/types/` - TypeScript types
- `src/utils/` - Utility functions

**Frontend:**
- `src/` - Main source directory
- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable components
- `src/contexts/` - React contexts
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility libraries
- `src/modules/` - Feature modules
- `src/types/` - TypeScript types
- `src/utils/` - Utility functions
- `src/styles/` - Global styles
- `src/graphql/` - GraphQL operations
- `src/config/` - Configuration files

### Monorepo Structure
- Use scoped packages with @aqa/* prefix
- Follow conventional commit messages
- Use turbo.json for build configuration
- Leverage pnpm workspaces for dependency management
- Implement proper dependency relationships
- Use turbo cache for faster builds

### Documentation
- Keep code self-documenting
- Add JSDoc comments for complex functions
- Use inline comments for non-obvious logic
- Update documentation when changing APIs
- Follow existing documentation patterns

### Performance
- Use lazy loading for large components
- Implement proper caching strategies
- Optimize database queries
- Use pagination for large datasets
- Implement code splitting for Next.js
- Use React.memo for expensive components
- Implement proper debouncing/throttling

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Use proper color contrast
- Test with screen readers
- Follow WCAG guidelines

### Deployment
- Use Docker for containerization
- Use Docker Compose for orchestration
- Implement proper environment configurations
- Use CI/CD pipelines for automated deployment
- Follow deployment documentation
- Test deployment in staging environment