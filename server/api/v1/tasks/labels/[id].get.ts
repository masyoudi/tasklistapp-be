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
          id,
          title,
          color,
          created_at,
          created_by,
          updated_at,
          updated_by
        FROM task_labels
        WHERE id          = $id
        AND created_by    = $createdBy
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
