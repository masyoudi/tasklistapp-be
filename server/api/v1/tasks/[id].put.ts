import { z } from 'zod';
import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

const schema = z.object({
  title: z.coerce.string().min(1, 'Please enter title'),
  description: z.coerce.string().min(1, 'Please enter description'),
});

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const { data: raw } = await validateBody(event, { schema });

      const sql = useSqlPool();
      const values = {
        $title: raw.title,
        $description: raw.description,
        $updatedAt: new Date().valueOf(),
        $updatedBy: event.context.session.user.id,
        $id: event.context.params.id,
      };

      await sql.query(
        `UPDATE tasks
           SET title   = $title,
           description = $description,
           updated_at  = $updatedAt,
           updated_by  = $updatedBy
         WHERE id      = $id
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
