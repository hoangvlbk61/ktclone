const db = require("../persistence/db");

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY,
    description text,
    name text, 
    reward INT NOT NULL,
    related_data text
  );
  `);
  await client.query(`
  CREATE INDEX tasks_user on tasks (id);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE users;
  DROP TABLE tasks;
  `);

  await client.release(true);
  next();
};
