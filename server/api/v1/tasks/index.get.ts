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
      };

      const querySearch = q.search ? `AND LOWER(t.title) LIKE $search` : '';

      const { rows } = await sql.query(
        `SELECT
          (SELECT COUNT(t.id)::INT
            FROM tasks t
            LEFT JOIN task_labels tl
              ON t.label_id = tl.id
            WHERE t.created_by = $createdBy
            ${querySearch}
          ) as total,
          (SELECT json_agg(result.*)
            FROM (
              SELECT
                t.id,
                t.title,
                t.description,
                t.label_id,
                tl.title AS label_name,
                t.due_date,
                t.created_at,
                t.created_by,
                t.updated_at,
                t.updated_by
              FROM tasks t
              LEFT JOIN task_labels tl
                ON t.label_id = tl.id
              WHERE t.created_by = $createdBy
              ${querySearch}
              ORDER BY t.created_by
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
