import { UserRepository } from "../repositories/user.repository.js";
import { env } from "../config/env.js";
import logger from "../config/logger.js";

let timer = null;

const run = async () => {
  try {
    const count = await UserRepository.purgeExpired();
    if (count > 0) logger.info(`Account purge: deleted ${count} account(s)`);
  } catch (err) {
    logger.error(`Account purge failed: ${err.message}`);
  }
};

/**
 * Фоновое автоудаление: раз в ACCOUNT_PURGE_INTERVAL_MS удаляет аккаунты,
 * у которых истёк delete_at (подтверждение + 7 дней). Первый прогон —
 * сразу при старте, чтобы наверстать время, пока сервер был выключен.
 */
export const AccountPurgeJob = {
  start() {
    if (timer) return;
    run();
    timer = setInterval(run, env.accountPurgeIntervalMs);
    timer.unref();
  },

  stop() {
    if (timer) clearInterval(timer);
    timer = null;
  },
};
