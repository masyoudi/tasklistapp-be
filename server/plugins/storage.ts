import { useRedis } from '~/utils/storage';

export default defineNitroPlugin(async () => {
  try {
    const redis = useRedis();
    // Connect to redis
    redis.getInstance();

    const storage = useStorage();
    storage.mount('redis', redis);
  }
  catch {
    // noop
  }
});
