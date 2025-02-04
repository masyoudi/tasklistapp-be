import driver from 'unstorage/drivers/redis';
import { app, cache } from '~~/config';

let redisDriver: ReturnType<typeof driver>;

export function useRedis() {
  if (!redisDriver) {
    redisDriver = driver({
      base: `${app.name}:`,
      host: cache.host,
      port: cache.port,
      ...(typeof cache.password === 'string' && cache.password !== '' && { password: cache.password }),
    });
  }

  return redisDriver;
}
