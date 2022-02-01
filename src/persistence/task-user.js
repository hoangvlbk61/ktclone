const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create({ user_id, task_id, status, turn}) {
    try {
      const { rows } = await db.query(sql`
      INSERT INTO task_user (id, user_id, task_id, status, turn)
        VALUES (${uuidv4()}, ${user_id}, ${task_id}, ${status}, ${turn})
        RETURNING *;
      `);

      const [task_user] = rows;
      return task_user;
    } catch (error) {
      return null;
    }
  },
  async findByUserAndTask(user_id, task_id) {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user WHERE user_id=${user_id} and task_id=${task_id};
    `);
    return rows;
  },
  async findByUser(user_id) {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user WHERE user_id=${user_id};
    `);
    return rows;
  },
  async getLastUserTaskByUser(user_id) {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user WHERE user_id=${user_id} LIMIT 1;
    `);
    return rows[0];
  },
  async findById(id) {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async list() {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user ;
    `);
    return rows;
  },
  async listTaskDoneByUser(user_id) {
    const { rows } = await db.query(sql`
    SELECT *
    FROM (SELECT task_user.task_id AS task_id,
        task_user.user_id AS user_id ,
        task_user.status AS status,
        task_user.turn AS turn,
        tasks.name AS name,
        tasks.reward AS reward,
        tasks.description AS description
        FROM task_user
        JOIN tasks ON task_user.task_id = tasks.id) AS R
      WHERE user_id='${user_id}' and status=true
    `);
    return rows;
  },
};
