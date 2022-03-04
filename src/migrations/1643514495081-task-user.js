const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS task_user (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    task_id uuid REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE,
    status boolean NOT NULL, 
    turn int NOT NULL,
    created_at timestamptz,
    updated_at timestamptz
  );
  `);
  await client.query(`
  CREATE INDEX IF NOT EXISTS task_user_idx on task_user (id);
  `);

  // Create trigger and producer for auto add createAt & updatedAt for user_task
  await client.query(`
  CREATE FUNCTION user_task_timestamp_create() RETURNS trigger AS $user_task_timestamp_create$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $user_task_timestamp_create$ LANGUAGE plpgsql;

  CREATE TRIGGER user_task_timestamp_create BEFORE INSERT ON task_user
    FOR EACH ROW EXECUTE PROCEDURE user_task_timestamp_create();

  CREATE FUNCTION user_task_timestamp_update() RETURNS trigger AS $user_task_timestamp_update$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $user_task_timestamp_update$ LANGUAGE plpgsql;

  CREATE TRIGGER user_task_timestamp_update BEFORE UPDATE ON task_user
    FOR EACH ROW EXECUTE PROCEDURE user_task_timestamp_update();

  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TRIGGER user_task_timestamp_create on task_user;
    DROP TRIGGER user_task_timestamp_update on task_user;
    DROP INDEX IF EXISTS task_user_idx;
    DROP FUNCTION user_task_timestamp_create;
    DROP FUNCTION user_task_timestamp_update;
    DROP TABLE task_user;
  `);

  await client.release(true);
  next();
};
