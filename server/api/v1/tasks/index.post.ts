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
        $createdAt: new Date().valueOf(),
        $createdBy: event.context.session.user.id,
      };
      await sql.query(
        `INSERT INTO tasks (
           title,
           description,
           created_at,
           created_by
         )
         VALUES (
           $title,
           $description,
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
