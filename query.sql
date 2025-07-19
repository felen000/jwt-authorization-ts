Queries for creating tables

create TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isActivated BOOLEAN DEFAULT FALSE,
    activationLink TEXT
);

create TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    refreshToken TEXT NOT NULL
);