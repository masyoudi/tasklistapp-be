import { z } from 'zod';
import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

const schema = z.object({
  name: z.coerce.string().min(1, 'Please enter your full name'),
  email: z.coerce.string().min(1, 'Please enter email').email('Invalid email address'),
});

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const { data: raw } = await validateBody(event, { schema });

      const sql = useSqlPool();
      const values = {
        $name: raw.name,
        $email: raw.email,
        $updatedAt: new Date().valueOf(),
        $updatedBy: event.context.session.user.id,
        $id: event.context.session.user.id,
      };
      await sql.query(
        `
        UPDATE users
        SET name       = $name,
            email      = $email,
            updated_at = $updatedAt,
            updated_by = $updatedBy
        WHERE id       = $id
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
