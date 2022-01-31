const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text UNIQUE,
    password text NOT NULL,
    telephone text NOT NULL,
    name text NOT NULL, 
    address text,
    balance int NOT NULL,
    user_social_id text NOT NULL, 
    created_at timestamptz,
    updated_at timestamptz
  );
  
  CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE
    );
    `);

  // Index for faster db query
  await client.query(`
  CREATE INDEX users_email on users (email);
  CREATE INDEX sessions_user on sessions (user_id);
  `);

  // Create trigger and producer for auto add createAt & updatedAt for user
  await client.query(`
  CREATE FUNCTION user_timestamp_create() RETURNS trigger AS $user_timestamp_create$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $user_timestamp_create$ LANGUAGE plpgsql;

  CREATE TRIGGER user_timestamp_create BEFORE INSERT ON users
    FOR EACH ROW EXECUTE PROCEDURE user_timestamp_create();
  
    CREATE FUNCTION user_timestamp_update() RETURNS trigger AS $user_timestamp_update$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $user_timestamp_update$ LANGUAGE plpgsql;

  CREATE TRIGGER user_timestamp_update BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE user_timestamp_update();

  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE sessions;
  DROP TABLE users;
  `);
  // DROP TRIGGER user_timestamp_create on users;
  // DROP TRIGGER user_timestamp_update on users;

  await client.release(true);
  next();
};
