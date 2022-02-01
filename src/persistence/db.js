const { Pool } = require("pg");

const pool = new Pool({
  max: 10,
  // connectionString: process.env.DATABASE_URL,
  user: "user",
  database: "db",
  password: "pass",
  port: "35432",
  host: "192.168.1.8",
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Database connected");
  });
});

module.exports = pool;
