import type { H3Event } from 'h3';

export const userSessionkey = (suffix: string) => 'user-session:'.concat(suffix);

export async function getUserSession(event: H3Event) {
  const sessHeader = getHeader(event, 'X-Session');

  if (!sessHeader) {
    return null;
  }

  const redis = useStorage('redis');
  const item = await redis.getItem(userSessionkey(sessHeader));

  if (!item) {
    return null;
  }

  return item;
}
