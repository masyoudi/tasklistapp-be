import { z } from 'zod';
import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

const schema = z.object({
  title: z.coerce.string().min(1, 'Please enter title'),
  color: z.coerce.string().min(4, 'Invalid color').optional(),
});

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const { data: raw } = await validateBody(event, { schema });

      const sql = useSqlPool();
      const values = {
        $title: raw.title,
        $color: raw.color ?? null,
        $updatedAt: new Date().valueOf(),
        $userId: event.context.session.user.id,
        $id: event.context.params.id,
      };

      await sql.query(
        `UPDATE task_labels
         SET title         = $title,
           color           = $color,
           updated_at      = $updatedAt,
           updated_by      = $userId
         WHERE id          = $id
         AND created_by    = $userId
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
