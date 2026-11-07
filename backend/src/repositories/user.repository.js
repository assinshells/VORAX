import { pool } from "../config/database.js";

const PROFILE_COLUMNS =
  "id, email, nickname, company_name, first_name, last_name, created_at, restarted_at, delete_at";

export const UserRepository = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT id, email, password_hash, email_verified FROM users WHERE email = $1",
      [email],
    );
    return rows[0] ?? null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT id, email, password_hash, email_verified FROM users WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  },

  async create({ passwordHash, email }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const emailCheck = await client.query(
        "SELECT id FROM users WHERE email = $1 FOR UPDATE",
        [email],
      );
      if (emailCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return null;
      }

      const { rows } = await client.query(
        "INSERT INTO users (password_hash, email) VALUES ($1, $2) RETURNING id",
        [passwordHash, email],
      );

      await client.query("COMMIT");
      return rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async markEmailVerified(id) {
    await pool.query("UPDATE users SET email_verified = TRUE WHERE id = $1", [
      id,
    ]);
  },

  async updatePassword(id, passwordHash) {
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      id,
    ]);
  },

  async findProfileById(id) {
    const { rows } = await pool.query(
      `SELECT ${PROFILE_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  /**
   * Сохраняет стартовые данные. Возвращает:
   *  - профиль — успех;
   *  - "taken" — никнейм занят другим пользователем;
   *  - null — пользователь не найден.
   */
  async saveSetup(id, { nickname, companyName, firstName, lastName }) {
    try {
      const { rows } = await pool.query(
        `UPDATE users
            SET nickname = $1, company_name = $2, first_name = $3, last_name = $4
          WHERE id = $5
      RETURNING ${PROFILE_COLUMNS}`,
        [nickname, companyName, firstName, lastName, id],
      );
      return rows[0] ?? null;
    } catch (err) {
      if (err.code === "23505") return "taken"; // unique_violation (nickname)
      throw err;
    }
  },

  /** «Начать заново»: стираем все параметры, фиксируем дату рестарта. */
  async restart(id) {
    const { rows } = await pool.query(
      `UPDATE users
          SET nickname = NULL, company_name = NULL, first_name = NULL,
              last_name = NULL, restarted_at = NOW()
        WHERE id = $1
    RETURNING ${PROFILE_COLUMNS}`,
      [id],
    );
    return rows[0] ?? null;
  },

  /**
   * Помечает аккаунт на удаление через `days` дней. Повторный вызов срок
   * не сдвигает (COALESCE): уже назначенное время остаётся прежним.
   */
  async markForDeletion(id, days) {
    const { rows } = await pool.query(
      `UPDATE users
          SET delete_at = COALESCE(delete_at, NOW() + make_interval(days => $2))
        WHERE id = $1
    RETURNING ${PROFILE_COLUMNS}`,
      [id, days],
    );
    return rows[0] ?? null;
  },

  async cancelDeletion(id) {
    const { rows } = await pool.query(
      `UPDATE users SET delete_at = NULL WHERE id = $1
    RETURNING ${PROFILE_COLUMNS}`,
      [id],
    );
    return rows[0] ?? null;
  },

  /** Окончательно удаляет аккаунты с истёкшим delete_at. Возвращает их число. */
  async purgeExpired() {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE delete_at IS NOT NULL AND delete_at <= NOW()",
    );
    return rowCount;
  },

  /** "taken" — почта занята; null — пользователь не найден. */
  async updateEmail(id, email) {
    try {
      const { rows } = await pool.query(
        `UPDATE users SET email = $1 WHERE id = $2
      RETURNING ${PROFILE_COLUMNS}`,
        [email, id],
      );
      return rows[0] ?? null;
    } catch (err) {
      if (err.code === "23505") return "taken";
      throw err;
    }
  },
};
