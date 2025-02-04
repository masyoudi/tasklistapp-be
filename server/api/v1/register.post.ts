import bcrypt from 'bcrypt';
import { z } from 'zod';
import { useSqlPool } from '~/utils/db';
import { defaultUserId } from '~/utils/defaults';
import { sendErrorServer } from '~/utils/error';
import { validateBody } from '~/utils/validator';

const schema = z.object({
  username: z.coerce.string().min(1, 'Please enter username'),
  name: z.coerce.string().min(1, 'Please enter your full name'),
  email: z.coerce.string().min(1, 'Please enter email').email('Invalid email address'),
  password: z.coerce.string().min(8, 'Please enter minimal 8 characters long'),
});

export default defineEventHandler(async (event) => {
  try {
    const { data: raw } = await validateBody(event, { schema });

    const sql = useSqlPool();
    const { rows } = await sql.query(
      'SELECT username FROM users WHERE username = $username',
      {
        $username: raw.username,
      },
    );

    if (rows.length > 0) {
      throw createError({ statusCode: 500, message: 'Username already exists' });
    }

    const values = {
      $username: raw.username,
      $name: raw.name,
      $email: raw.email,
      $password: await bcrypt.hash(raw.password, 10),
      $createdAt: new Date().valueOf(),
      $createdBy: defaultUserId,
    };

    await sql.query(
      `INSERT INTO users (
          username,
          name,
          email,
          password,
          created_at,
          created_by
       )
       VALUES (
          $username,
          $name,
          $email,
          $password,
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
});
