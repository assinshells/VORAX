CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    nickname VARCHAR(20) UNIQUE,
    company_name VARCHAR(40),
    first_name VARCHAR(15),
    last_name VARCHAR(15),
    restarted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
