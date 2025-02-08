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
        $taskId: event.context.params.id,
        $createdAt: new Date().valueOf(),
        $createdBy: event.context.session.user.id,
      };

      await sql.query(
        `INSERT INTO task_notes (
           content,
           task_id,
           created_at,
           created_by
         )
         VALUES (
           $content,
           $taskId,
           $createdAt,
           $createdBy
         )
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
