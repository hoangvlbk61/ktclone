const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY,
    description text,
    name text, 
    reward INT NOT NULL,
    priority INT NOT NULL,
    type_task INT NOT NULL,
    related_data text,
    max_turn INT NOT NULL,
    created_at timestamptz,
    updated_at timestamptz
  );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS tasks_idx on tasks (id);
  `);

  // Create trigger and producer for auto add createAt & updatedAt for task
  await client.query(`
  CREATE FUNCTION task_timestamp_create() RETURNS trigger AS $task_timestamp_create$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $task_timestamp_create$ LANGUAGE plpgsql;

  CREATE TRIGGER task_timestamp_create BEFORE INSERT ON tasks
    FOR EACH ROW EXECUTE PROCEDURE task_timestamp_create();

  CREATE FUNCTION task_timestamp_update() RETURNS trigger AS $task_timestamp_update$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $task_timestamp_update$ LANGUAGE plpgsql;

  CREATE TRIGGER task_timestamp_update BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE PROCEDURE task_timestamp_update();

  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE tasks;
  `);

  await client.release(true);
  next();
};
