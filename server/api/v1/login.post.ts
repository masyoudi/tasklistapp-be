import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { cache } from '~~/config';
import { useSqlPool } from '~/utils/db';
import { sendErrorServer } from '~/utils/error';
import { validateBody } from '~/utils/validator';

const schema = z.object({
  username: z.coerce.string().min(1, 'Please enter username'),
  password: z.coerce.string().min(1, 'Please enter your secret password'),
});

export default defineEventHandler(async (event) => {
  try {
    const { data: raw } = await validateBody(event, { schema });

    const sql = useSqlPool();
    const { rows } = await sql.query(
      `SELECT
         id,
         username,
         name,
         email,
         password,
         created_at,
         created_by,
         updated_at,
         updated_by
       FROM users
       WHERE username = $username
      `,
      {
        $username: raw.username,
      },
    );

    if (!rows.length) {
      throw createError({ statusCode: 500, message: 'User not found' });
    }

    const row = rows[0] as Record<string, any>;
    const isValidPassword = bcrypt.compareSync(raw.password, row.password);
    if (!isValidPassword) {
      throw createError({ statusCode: 500, message: 'Invalid password' });
    }

    const user = {
      id: row.id,
      username: row.username,
      email: row.email,
      created_at: row.created_at,
      created_by: row.created_by,
      updated_at: row.updated_at,
      updated_by: row.updated_by,
    };
    const date = new Date();
    const session = {
      value: uuidv4(),
      expiry: new Date(date.valueOf() + cache.expiry * 1000).valueOf(),
    };

    const redis = useStorage('redis');
    await redis.setItem(`user-session:${session.value}`, JSON.stringify(user), { ttl: cache.expiry });

    const data = {
      user,
      session,
    };

    return {
      data,
    };
  }
  catch (err) {
    return sendErrorServer(event, err);
  }
});
