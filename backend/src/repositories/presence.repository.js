import { redisClient } from "../config/redis.js";
import { REDIS_KEYS } from "../constants/auth.constants.js";

// Клиент шлёт heartbeat каждые 30 с; если за 75 с сигнала нет — офлайн.
const PRESENCE_TTL_SECONDS = 75;

export const PresenceRepository = {
  async touch(userId) {
    await redisClient.set(REDIS_KEYS.presence(userId), "1", {
      EX: PRESENCE_TTL_SECONDS,
    });
  },

  async clear(userId) {
    await redisClient.del(REDIS_KEYS.presence(userId));
  },

  async isOnline(userId) {
    return (await redisClient.exists(REDIS_KEYS.presence(userId))) === 1;
  },
};
