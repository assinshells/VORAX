import { pool } from "./database.js";
import logger from "./logger.js";

/**
 * Идемпотентная миграция схемы. init.sql выполняется Postgres только
 * при создании пустого тома, поэтому для уже существующих БД изменения
 * применяются здесь при старте сервера.
 */
export const migrate = async () => {
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS nickname VARCHAR(20),
      ADD COLUMN IF NOT EXISTS company_name VARCHAR(40),
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(15),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(15),
      ADD COLUMN IF NOT EXISTS restarted_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS delete_at TIMESTAMPTZ
  `);
  await pool.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname)",
  );
  // Никнейм при регистрации и выбор аватара удалены.
  await pool.query("DROP INDEX IF EXISTS idx_users_login");
  await pool.query(`
    ALTER TABLE users
      DROP COLUMN IF EXISTS login,
      DROP COLUMN IF EXISTS avatar,
      DROP COLUMN IF EXISTS gender
  `);
  logger.info("Database schema is up to date");
};
