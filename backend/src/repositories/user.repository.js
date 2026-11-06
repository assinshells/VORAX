import { pool } from "../config/database.js";

export const UserRepository = {
  async findByLogin(login) {
    const { rows } = await pool.query(
      "SELECT id, login, email, password_hash, email_verified FROM users WHERE login = $1",
      [login],
    );
    return rows[0] ?? null;
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT id, login, email, password_hash, email_verified FROM users WHERE email = $1",
      [email],
    );
    return rows[0] ?? null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT id, login, email, password_hash, email_verified FROM users WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  },

  async create({ login, passwordHash, email }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const loginCheck = await client.query(
        "SELECT id FROM users WHERE login = $1 FOR UPDATE",
        [login],
      );
      if (loginCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return null;
      }

      const emailCheck = await client.query(
        "SELECT id FROM users WHERE email = $1 FOR UPDATE",
        [email],
      );
      if (emailCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return null;
      }

      const { rows } = await client.query(
        "INSERT INTO users (login, password_hash, email) VALUES ($1, $2, $3) RETURNING id",
        [login, passwordHash, email],
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
      "SELECT id, login, email, avatar, gender FROM users WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  },

  async updateAvatar(id, avatar, gender) {
    const { rows } = await pool.query(
      "UPDATE users SET avatar = $1, gender = $2 WHERE id = $3 RETURNING id, login, email, avatar, gender",
      [avatar, gender, id],
    );
    return rows[0] ?? null;
  },
};
