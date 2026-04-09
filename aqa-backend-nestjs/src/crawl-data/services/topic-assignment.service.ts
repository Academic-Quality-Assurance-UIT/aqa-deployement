import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import axios from 'axios';

/**
 * Service to run PhoBERT ABSA topic assignment on comments.
 * Calls the external Python FastAPI service for inference
 * and updates comment rows directly in the database.
 */
@Injectable()
export class TopicAssignmentService {
  private readonly logger = new Logger(TopicAssignmentService.name);
  private readonly absaUrl: string;

  // Mapping from model output to DB values
  private static readonly TOPIC_MAPPING: Record<number, string> = {
    0: 'lecturer',
    1: 'training_program',
    2: 'facility',
    3: 'others',
  };

  private static readonly SENTIMENT_MAPPING: Record<string, string> = {
    Pos: 'positive',
    Neg: 'negative',
    Neu: 'neutral',
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.absaUrl =
      this.configService.get<string>('ABSA_SERVICE_URL') ||
      'http://localhost:8001';
  }

  /**
   * Run topic assignment for comments in the given semesters.
   * Updates comment.topic and comment.type_list directly.
   */
  async run(
    jobId: string,
    semesterIds?: string[],
    updateProgress?: (progress: number, total: number) => Promise<void>,
  ): Promise<{ total: number; success: number; failed: number }> {
    // 1. Check if ABSA service is healthy
    try {
      const healthResp = await axios.get(`${this.absaUrl}/health`, {
        timeout: 5000,
      });
      this.logger.log(
        `ABSA service health: ${JSON.stringify(healthResp.data)}`,
      );
    } catch (error: any) {
      throw new Error(
        `ABSA service is not available at ${this.absaUrl}: ${error.message}`,
      );
    }

    // 2. Count total comments to process
    let countQuery = `
      SELECT COUNT(*) as cnt
      FROM comment c
      INNER JOIN class cl ON cl.class_id = c.class_id
    `;
    const countParams: any[] = [];

    if (semesterIds && semesterIds.length > 0) {
      const placeholders = semesterIds.map((_, i) => `$${i + 1}`).join(', ');
      countQuery += ` WHERE cl.semester_id IN (${placeholders})`;
      countParams.push(...semesterIds);
    }

    const [{ cnt }] = await this.dataSource.query(countQuery, countParams);
    const totalComments = parseInt(cnt, 10);

    if (totalComments === 0) {
      this.logger.log('No comments found for the selected semesters.');
      return { total: 0, success: 0, failed: 0 };
    }

    this.logger.log(
      `Starting topic assignment for ${totalComments} comments...`,
    );

    // 3. Process in batches
    const BATCH_SIZE = 32;
    let processed = 0;
    let success = 0;
    let failed = 0;
    let offset = 0;

    while (offset < totalComments) {
      // Fetch a batch of comments
      let fetchQuery = `
        SELECT c.comment_id, c.content
        FROM comment c
        INNER JOIN class cl ON cl.class_id = c.class_id
      `;
      const fetchParams: any[] = [];

      if (semesterIds && semesterIds.length > 0) {
        const placeholders = semesterIds.map((_, i) => `$${i + 1}`).join(', ');
        fetchQuery += ` WHERE cl.semester_id IN (${placeholders})`;
        fetchParams.push(...semesterIds);
      }

      fetchQuery += ` ORDER BY c.comment_id LIMIT $${fetchParams.length + 1} OFFSET $${fetchParams.length + 2}`;
      fetchParams.push(BATCH_SIZE, offset);

      const comments = await this.dataSource.query(fetchQuery, fetchParams);
      if (comments.length === 0) break;

      const texts = comments.map((c: any) => c.content || '');
      const commentIds = comments.map((c: any) => c.comment_id);

      try {
        // Call ABSA service
        const response = await axios.post(
          `${this.absaUrl}/predict`,
          { texts, threshold: 0.5 },
          { timeout: 120000 }, // 2 min timeout per batch
        );

        const results = response.data.results;

        // Update each comment
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const commentId = commentIds[i];

          // Build type_list from sentiment pred_bin
          const typeList: string[] = [];
          for (const [sentKey, value] of Object.entries(
            result.sentiment.pred_bin,
          )) {
            if (value === 1) {
              const mapped = TopicAssignmentService.SENTIMENT_MAPPING[sentKey];
              if (mapped) typeList.push(mapped);
            }
          }

          const topicLabel = result.topic.label; // already mapped by Python service

          await this.dataSource.query(
            `UPDATE comment SET topic = $1, type_list = $2 WHERE comment_id = $3`,
            [topicLabel, typeList, commentId],
          );

          success++;
        }
      } catch (error: any) {
        this.logger.error(
          `Error processing batch at offset ${offset}: ${error.message}`,
        );
        failed += comments.length;
      }

      processed += comments.length;
      offset += BATCH_SIZE;

      // Report progress
      if (updateProgress) {
        await updateProgress(processed, totalComments);
      }

      this.logger.log(
        `Progress: ${processed}/${totalComments} (success: ${success}, failed: ${failed})`,
      );
    }

    return { total: totalComments, success, failed };
  }

  /**
   * Get a preview of comments for the given semesters.
   * Returns count and sample comments.
   */
  async getPreview(
    semesterIds?: string[],
    limit = 20,
    offset = 0,
  ): Promise<{
    totalComments: number;
    assignedComments: number;
    unassignedComments: number;
    samples: any[];
  }> {
    // Total count
    let countQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN c.topic IS NOT NULL AND c.topic != 'others' THEN 1 END) as assigned,
        COUNT(CASE WHEN c.topic IS NULL OR c.topic = 'others' THEN 1 END) as unassigned
      FROM comment c
      INNER JOIN class cl ON cl.class_id = c.class_id
    `;
    const countParams: any[] = [];

    if (semesterIds && semesterIds.length > 0) {
      const placeholders = semesterIds.map((_, i) => `$${i + 1}`).join(', ');
      countQuery += ` WHERE cl.semester_id IN (${placeholders})`;
      countParams.push(...semesterIds);
    }

    const [counts] = await this.dataSource.query(countQuery, countParams);

    // Sample comments
    let sampleQuery = `
      SELECT c.comment_id, c.content as display_name, c.topic, c.type_list,
             cl.display_name as class_name,
             s.display_name as semester_name
      FROM comment c
      INNER JOIN class cl ON cl.class_id = c.class_id
      INNER JOIN semester s ON s.semester_id = cl.semester_id
    `;
    const sampleParams: any[] = [];

    if (semesterIds && semesterIds.length > 0) {
      const placeholders = semesterIds.map((_, i) => `$${i + 1}`).join(', ');
      sampleQuery += ` WHERE cl.semester_id IN (${placeholders})`;
      sampleParams.push(...semesterIds);
    }

    sampleQuery += ` ORDER BY c.comment_id LIMIT $${sampleParams.length + 1} OFFSET $${sampleParams.length + 2}`;
    sampleParams.push(limit, offset);

    const samples = await this.dataSource.query(sampleQuery, sampleParams);

    return {
      totalComments: parseInt(counts.total, 10),
      assignedComments: parseInt(counts.assigned, 10),
      unassignedComments: parseInt(counts.unassigned, 10),
      samples,
    };
  }
}
