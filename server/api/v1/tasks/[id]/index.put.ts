import { z } from 'zod';
import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

const schema = z.object({
  title: z.coerce.string().min(1, 'Please enter title'),
  description: z.coerce.string().min(1, 'Please enter description'),
  due_date: z.number().refine((val) => {
    return val ? new Date(val).valueOf() >= new Date().valueOf() : true;
  }, 'Due date must be greater than now'),
  label_id: z.string().uuid('Invalid label').optional(),
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
        $dueDate: raw.due_date ?? null,
        $labelId: raw.label_id ?? null,
        $updatedAt: new Date().valueOf(),
        $userId: event.context.session.user.id,
        $id: event.context.params.id,
      };

      await sql.query(
        `UPDATE tasks
           SET title    = $title,
           description  = $description,
           due_date     = $dueDate,
           label_id     = $labelId,
           updated_at   = $updatedAt,
           updated_by   = $userId
         WHERE id       = $id
         AND created_by = $userId
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
