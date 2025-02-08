import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';
import { useURLQueryBuilder } from '~/utils/url';

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const q = useURLQueryBuilder(event);
      const sql = useSqlPool();

      const values = {
        $createdBy: event.context.session.user.id,
        $offset: q.offset,
        $limit: q.limit,
        $search: `%${q.search.toLowerCase()}%`,
        $taskId: event.context.params.id,
      };

      const querySearch = q.search ? `AND LOWER(content) LIKE $search` : '';

      const { rows } = await sql.query(
        `SELECT
          (SELECT COUNT(id)::INT
            FROM task_notes
            WHERE created_by = $createdBy
            AND task_id = $taskId
            ${querySearch}
          ) as total,
          (SELECT json_agg(result.*)
            FROM (
              SELECT
                id,
                content,
                task_id,
                created_at,
                created_by,
                updated_at,
                updated_by
              FROM task_notes
              WHERE created_by = $createdBy
              AND task_id = $taskId
              ${querySearch}
              ORDER BY created_by
              OFFSET $offset
              LIMIT $limit
            ) AS result
          ) AS rows
        `,
        values,
      );

      const [row] = rows;
      const data = {
        total: row.total ?? 0,
        rows: row?.rows ?? [],
      };

      return {
        data,
      };
    }
    catch (err) {
      return sendErrorServer(event, err);
    }
  },
});
