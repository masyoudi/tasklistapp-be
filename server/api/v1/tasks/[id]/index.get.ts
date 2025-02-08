import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const sql = useSqlPool();

      const values = {
        $id: event.context.params.id,
        $createdBy: event.context.session.user.id,
      };

      const { rows } = await sql.query(
        `SELECT
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
        WHERE t.id = $id
        AND t.created_by = $createdBy
        `,
        values,
      );

      const [row] = rows;

      return {
        data: row ?? null,
      };
    }
    catch (err) {
      return sendErrorServer(event, err);
    }
  },
});
