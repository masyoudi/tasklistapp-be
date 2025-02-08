import { z } from 'zod';
import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

const schema = z.object({
  content: z.coerce.string().min(1, 'Please enter content'),
});

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const { data: raw } = await validateBody(event, { schema });

      const sql = useSqlPool();
      const values = {
        $content: raw.content,
        $updatedAt: new Date().valueOf(),
        $userId: event.context.session.user.id,
        $id: event.context.params.note,
        $taskId: event.context.params.id,
      };

      await sql.query(
        `UPDATE task_notes 
         SET content      = $content,
           updated_at     = $updatedAt,
           updated_by     = $userId
         WHERE id         = $id
         AND task_id      = $taskId
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
