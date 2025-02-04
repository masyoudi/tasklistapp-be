import type { H3Event } from 'h3';
import { getUserSession } from '~/utils/session';

export const authCheck = defineEventHandler((event: H3Event) => {
  if (!event.context.session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }
});

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event);

  event.context.session = user ? { user } : null;
});
