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
        $color: raw.color,
        $createdAt: new Date().valueOf(),
        $createdBy: event.context.session.user.id,
      };

      await sql.query(
        `INSERT INTO task_labels (
           title,
           color,
           created_at,
           created_by
         )
         VALUES (
           $title,
           $color,
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
