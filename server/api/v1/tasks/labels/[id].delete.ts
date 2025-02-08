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
        $userId: event.context.session.user.id,
      };

      await sql.query(
        `DELETE FROM task_labels
         WHERE id         = $id
         AND created_by   = $userId
        `,
        values,
      );

      const data = {
        success: true,
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
