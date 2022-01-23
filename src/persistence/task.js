const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create({ description, name, reward, related_data}) {
    try {
      const { rows } = await db.query(sql`
      INSERT INTO tasks (id, description, name, reward, related_data)
        VALUES (${uuidv4()}, ${description}, ${name}, ${reward}, ${related_data})
        RETURNING *;
      `);

      const [task] = rows;
      return task;
    } catch (error) {
      // if (error.constraint === "users_email_key") {
      // }
      return null;

      throw error;
    }
  },
  async find(id) {
    const { rows } = await db.query(sql`
    SELECT * FROM tasks WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async list() {
    const { rows } = await db.query(sql`
    SELECT * FROM tasks ;
    `);
    return rows;
  },
};
