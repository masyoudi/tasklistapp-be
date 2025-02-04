import type { H3Event } from 'h3';
import type { z } from 'zod';

interface Options<T> {
  schema: z.ZodType<T> | ((data: any) => z.ZodType<T>);
}

export async function validateBody<T extends Record<string, any>>(event: H3Event, options: Options<T>) {
  const body = await readBody(event);
  const { schema } = options;

  const result = typeof schema === 'function' ? schema(body).safeParse(body) : schema.safeParse(body);

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors).reduce((prev: Record<string, string>, [key, val]) => {
      prev[key] = (val as string[])[0];
      return prev;
    }, {});

    const data = {
      errors,
    };

    throw createError({
      statusCode: 400,
      message: 'Please check your input',
      ...(Object.keys(errors).length > 0 && { data }),
    });
  }

  return {
    data: result.data,
  };
}
