# Subject Survey Crawling System - Requirements Documentation

This document lists all the necessary requirements for the "Student Subject Survey" crawling system. It is designed to be used as a reference material for rewriting or upgrading the system architecture in the future.

## 1. System Integration Requirements (API Connectivity)
- **Authentication:** The system must securely store and attach API tokens (e.g. JWT) in the Bearer authorization header for all HTTP requests to the external Survey API.
- **Pagination Handling:** The system must iteratively navigate through paginated datasets, as the external Survey API limits records per request (e.g., limit 50).
- **Concurrency & Rate Limiting:** The system should fetch data concurrently via batch promises (e.g. 5 concurrent pages at once) to increase speed, but it MUST implement exponential backoff logic to catch `HTTP 429 Too Many Requests` when limits are reached.
- **Fault Tolerance:** API requests should have a timeout configured (e.g., 30s) and fallback mechanisms to avoid hanging threads. Failed surveys shouldn't abort the entire job; errors should be isolated and skipped.

## 2. Job Observability & Progress Tracking Requirements
- **Real-time Progress Calculation:** The crawler must proactively update a `CrawlJob` tracking record in the database.
- **Dynamic Totals:** Because the exact row count of responses is unknown beforehand, the system must deduce the total from the metadata of the `page=1` request, aggregating it across multiple Survey IDs (SIDs).
- **Progress Tracking:** The system must increment completion counters actively as rows are parsed, streaming this context back to the database.
- **Auditing / Request Logging:** Every HTTP request to the external service must be logged into a tracking system (`CrawlJobLog`), containing the endpoint method, target URL, duration of the request in milliseconds, status code, and any stack trace or failure context.

## 3. Data Extraction & Transformation Requirements
The crawler must extract specific, nested data structures from raw external JSON schemas and pivot them into relational system variables:
- **Faculty:** Extracted using field code `nganhhoc`.
- **Subject:** Extracted using field code `tenmh`.
- **Lecturer:** Extracted using field code `tengv`.
- **Class:** Extracted using field code `mamh`. The system MUST cross-reference the class code with a pre-fetched 'Survey Detail' matrix to determine the student's `program` context.
- **Criteria Generation:** The crawler must auto-generate evaluative Criteria by parsing `type = "F"` questions containing `sub_questions`.
- **Score (Point) Translation:** Textual score variables (e.g., "MH01", "MH04") embedded in answers MUST be translated into numeric scaled integers (1 through 4) referencing student feedback.
- **Comments (Text Analysis):** The crawler distinguishes open text responses. Code `Q25` maps to Positive Comments, and Code `Q26` maps to Negative Comments.

## 4. Staging and Persistence Architecture Requirements
- **Staging Step:** The system SHOULD NOT write parsed answers straight into production tables. Due to potential crashes, data must be inserted as chunks into an intermediary "Staging" storage layer (e.g., `CrawlStagingData` with flexible JSON properties).
- **Manual Confirmation Flow:** A secondary process (User Trigger/Confirmation) takes the staged data and migrates it into active production tables.
- **Transactional Consistency:** Moving data from staging to production must execute under a highly consistent database Transaction. If anything fails, the entire transaction rolls back.
- **Smart Deduplication & Foreign Keys:**
  - The migration flow must avoid `UNIQUE CONSTRAINT` collisions explicitly.
  - An application-side cache pattern (like a JavaScript Map of known UUIDs) should be utilized. When inserting a class, it must query the cache first before doing an SQL lookup to resolve the Subject ID or Faculty ID sequentially. Postgres `ON CONFLICT` patterns should be utilized where cache usage is too heavy.

## 5. Security & State Processing
- **Job Abandonment/Status Monitoring:** If an active system restarts or crashes while crawling, there must be a recovery mechanism or a timeout checking monitor (e.g., a background loop sweeping `last_activity_at > 15s`) to fail orphaned jobs.
- **Graceful Job Stopping:** The user must be able to trigger an interrupt signal via the database or memory (e.g., changing status to `ABANDONED`). The crawler must respect this flag and safely abort execution prior to proceeding to the next survey chunk.
