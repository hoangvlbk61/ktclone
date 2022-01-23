const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text UNIQUE,
    password text,
    telephone text NOT NULL,
    name text NOT NULL, 
    address text,
    balance INT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users (id) ON DELETE CASCADE
    );
    `);
    // CREAT TABLE IF NOT EXIST user_tasks (
    //   user_id uuid NOT NULL,
    //   task_id uuid NOT NULL,
    //   PRIMARY KEY (user_id, task_id),
    //   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, 
    //   FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    // )

  await client.query(`
  CREATE INDEX users_email on users (email);

  CREATE INDEX sessions_user on sessions (user_id);
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

  await client.release(true);
  next();
};
