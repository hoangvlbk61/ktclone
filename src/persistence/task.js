const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create({
    description = "",
    name,
    reward,
    related_data = "{}",
    max_turn,
    priority,
    type_task,
    list_posts,
    unlock_link = "",
  }) {
    try {
      if(!list_posts || !Array.isArray(list_posts)) throw new Error("list_posts invalid");
      const { rows } = await db.query(sql`
      INSERT INTO tasks (id, description, name, reward, related_data, max_turn, priority, type_task, list_posts, unlock_link)
        VALUES (${uuidv4()}, ${description}, ${name}, ${reward}, ${related_data}, ${max_turn}, ${priority}, ${type_task}, ${list_posts}, ${unlock_link})
        RETURNING *;
      `);

      const [task] = rows;
      return task;
    } catch (error) {
      // if (error.constraint === "users_email_key") {
      // }
      console.log("Create task error", error)
      return null;

      throw error;
    }
  },
  async findById(id) {
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
  async update({ description, name, reward, priority, type_task, related_data, max_turn, id, list_posts }) {
    const updateObj = { description, name, reward, priority, type_task, related_data, max_turn, list_posts};
    Object.keys(updateObj).forEach((k) => {
      if (updateObj[k] === undefined || updateObj[k] === null)
        delete updateObj[k];
    });
    const val = [];
    const updateCondStr = Object.keys(updateObj).map((k, idx) => {
      val.push(updateObj[k]);
      return `${k}= $${idx + 1}`;
    }).join(", ");
    let query = `UPDATE tasks SET ${updateCondStr} WHERE id=$${val.length + 1} RETURNING *`; 
    try {
      const { rows } = await db.query(query, [...val, id]);

      const [task] = rows;
      return task;
    } catch (error) {
      throw error;
    }
  },
  async delete(id) {
    try {
      const { rows } = await db.query(sql`
      DELETE FROM tasks
      WHERE id=${id}
      RETURNING *;
      `);

      const [task] = rows;
      return task;
    } catch (error) {
      return null;
    }
  },
};
