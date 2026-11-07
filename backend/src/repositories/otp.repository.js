import { redisClient } from "../config/redis.js";
import { REDIS_KEYS } from "../constants/auth.constants.js";
import { authConfig } from "../config/auth.config.js";

/**
 * OtpRepository — работа с OTP и verified-токенами в Redis.
 */
export const OtpRepository = {
  async saveOtp(userId, purpose, otp) {
    await redisClient.set(REDIS_KEYS.otp(userId, purpose), otp, {
      EX: authConfig.otp.ttlSeconds,
    });
  },

  async getOtp(userId, purpose) {
    return redisClient.get(REDIS_KEYS.otp(userId, purpose));
  },

  async deleteOtp(userId, purpose) {
    await redisClient.del(REDIS_KEYS.otp(userId, purpose));
  },

  /**
   * Инкрементирует счётчик неверных попыток ввода OTP для userId.
   * TTL счётчика выставляется равным OTP TTL при первом инкременте,
   * чтобы счётчик не пережил сам код и не блокировал следующий запрос OTP.
   */
  async incrementAttempts(userId, purpose) {
    const key = REDIS_KEYS.otpAttempts(userId, purpose);
    const count = await redisClient.incr(key);
    if (count === 1) {
      await redisClient.expire(key, authConfig.otp.ttlSeconds);
    }
    return count;
  },

  async deleteAttempts(userId, purpose) {
    await redisClient.del(REDIS_KEYS.otpAttempts(userId, purpose));
  },

  // Новая почта, ожидающая подтверждения кодом (живёт ровно как код).
  async savePendingEmail(userId, email) {
    await redisClient.set(REDIS_KEYS.pendingEmail(userId), email, {
      EX: authConfig.otp.ttlSeconds,
    });
  },

  async getPendingEmail(userId) {
    return redisClient.get(REDIS_KEYS.pendingEmail(userId));
  },

  async deletePendingEmail(userId) {
    await redisClient.del(REDIS_KEYS.pendingEmail(userId));
  },

  async saveVerifiedToken(token, userId) {
    await redisClient.set(REDIS_KEYS.otpVerified(token), String(userId), {
      EX: authConfig.otp.ttlSeconds,
    });
  },

  async getVerifiedToken(token) {
    return redisClient.get(REDIS_KEYS.otpVerified(token));
  },

  async deleteVerifiedToken(token) {
    await redisClient.del(REDIS_KEYS.otpVerified(token));
  },
};