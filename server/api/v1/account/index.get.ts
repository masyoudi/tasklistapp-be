import { authCheck } from '~/middleware';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';

export default defineEventHandler({
  onRequest: [authCheck],
  handler: async (event) => {
    try {
      const sql = useSqlPool();
      const { rows } = await sql.query(
        `
        SELECT
          id,
          username,
          name,
          email,
          created_at,
          created_by,
          updated_at,
          updated_by
        FROM users
        WHERE id = $id
        `,
        {
          $id: event.context.session.user.id,
        },
      );

      if (!rows.length) {
        throw createError({ statusCode: 500, message: 'Data not found' });
      }

      const [row] = rows;
      const data = {
        id: row.id,
        username: row.username,
        name: row.name,
        email: row.email,
        created_at: row.created_at,
        created_by: row.created_by,
        updated_at: row.updated_at,
        updated_by: row.updated_by,
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
