import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const sql = useSqlPool();
      const values = {
        $id: event.context.params.note,
        $taskId: event.context.params.id,
        $createdBy: event.context.session.user.id,
      };

      await sql.query(
        `DELETE FROM task_notes 
         WHERE id        = $id
         AND task_id     = $taskId
         AND created_by  = $createdBy
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
