import { pool } from "./database.js";
import logger from "./logger.js";

/**
 * Идемпотентная миграция схемы. init.sql выполняется Postgres только
 * при создании пустого тома, поэтому для уже существующих БД новые
 * колонки добавляются здесь при старте сервера.
 */
export const migrate = async () => {
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(32) NOT NULL DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS gender VARCHAR(16) NOT NULL DEFAULT 'unknown'
  `);
  logger.info("Database schema is up to date");
};
