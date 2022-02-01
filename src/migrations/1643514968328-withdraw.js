const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS withdraw (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON UPDATE CASCADE,
    status int NOT NULL, 
    created_at timestamptz,
    updated_at timestamptz
  );
  `);
  await client.query(`
  CREATE INDEX IF NOT EXISTS withdraw_idx on withdraw (id);
  `);

  // Create trigger and producer for auto add createAt & updatedAt for withdraw
  await client.query(`
  CREATE FUNCTION withdraw_timestamp_create() RETURNS trigger AS $withdraw_timestamp_create$
    BEGIN
      -- Remember who changed the payroll when
      NEW.created_at := current_timestamp;
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $withdraw_timestamp_create$ LANGUAGE plpgsql;

  CREATE TRIGGER withdraw_timestamp_create BEFORE INSERT ON withdraw
    FOR EACH ROW EXECUTE PROCEDURE withdraw_timestamp_create();

  CREATE FUNCTION withdraw_timestamp_update() RETURNS trigger AS $withdraw_timestamp_update$
    BEGIN
      -- Remember who changed the payroll when
      NEW.updated_at := current_timestamp;
      RETURN NEW;
    END;
    $withdraw_timestamp_update$ LANGUAGE plpgsql;

  CREATE TRIGGER withdraw_timestamp_update BEFORE UPDATE ON withdraw
    FOR EACH ROW EXECUTE PROCEDURE withdraw_timestamp_update();

  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE withdraw;
  `);

  await client.release(true);
  next();
};
