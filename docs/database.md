# Database Schema & Management

The AQA project uses **PostgreSQL** as its primary relational database. Data is managed through **TypeORM** in the NestJS backend and direct SQL/`pg` in the crawler scripts.

---

## Core Entities

### 1. Academic Structure
- **`faculty`**: Organizational units (e.g., Faculty of Computer Science).
- **`lecturer`**: Faculty members with profile details (MSC, email, gender, academic title).
- **`subject`**: Courses taught within faculties.
- **`semester`**: Academic time periods (e.g., Semester 1, 2023-2024).
- **`class`**: Specific instances of a subject in a semester, tied to a lecturer.

### 2. Survey & Feedback
- **`criteria`**: Evaluation metrics for academic surveys.
- **`point`**: Numerical scores assigned to classes based on criteria.
- **`comment`**: Qualitative feedback provided by students or staff.

### 3. Staff Surveys
- **`staff_survey_batch`**: Groups collection of staff surveys by time/event.
- **`staff_survey_criteria`**: Metrics specifically for staff evaluation.
- **`staff_survey_sheet`**: A single completed survey for a staff member.
- **`staff_survey_point`**: Scores and specific comments within a staff survey sheet.

### 4. User & Security
- **`user_entity`**: System users with credentials and roles.
  - **Roles**: `ADMIN`, `FACULTY`, `LECTURER`, `FULL_ACCESS`.
- **`permission_entity`**: Mapping for fine-grained access control to specific lecturers or faculties.

---

## Extensions & Optimization

The database utilizes several PostgreSQL extensions for advanced searching:
- `uuid-ossp`: For generating UUID primary keys.
- `unaccent`: Removes diacritics for insensitive searching.
- `pg_trgm`: Trigram-based fuzzy text searching.
- `btree_gin`: Optimized indexing for complex queries.

---

## Management

### migrations
In the `@aqa/backend` package, migrations are handled via TypeORM.
```bash
# Generate a migration
pnpm --filter @aqa/backend typeorm migration:generate src/migrations/Name
# Run migrations
pnpm --filter @aqa/backend typeorm migration:run
```

### Initializing Data
The `aqa-crawl-data` package contains scripts to populate the database from external sources.
```bash
# Example: Import staff survey data
pnpm --filter @aqa/crawl-data run copy-staff-survey
```
