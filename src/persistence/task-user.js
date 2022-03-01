const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create(user_id, task_id, status, turn = 1) {
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
    SELECT * FROM task_user WHERE user_id=${user_id} ORDER BY turn DESC LIMIT 1;
    `);
    return rows[0];
  },
  async findById(id) {
    const { rows } = await db.query(sql`
    SELECT * FROM task_user WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async findCurrentTask(user_id, task_id) {
    const dataQuery = { user_id, status: false, task_id  };
    Object.keys(dataQuery).forEach((k) => {
      if (dataQuery[k] === undefined || dataQuery[k] === null)
        delete dataQuery[k];
    });
    let query = `SELECT tasks.id AS id,
    tasks.description AS description,
    tasks.name AS name,
    tasks.reward AS reward,
    tasks.priority AS priority,
    tasks.type_task AS type_task,
    tasks.related_data AS related_data,
    tasks.max_turn AS max_turn,
    tasks.created_at AS created_at,
    tasks.updated_at AS updated_at,
    tasks.list_posts AS list_posts,
    task_user.created_at AS tu_created_at,
    task_user.updated_at AS tu_updated_at,
    task_user.turn AS turn,
    task_user.id AS task_user_id
    FROM tasks JOIN task_user ON task_user.task_id=tasks.id WHERE user_id = $1 and status = $2`; 
    if(task_id) query = `${query} and task_id = $3`; 
    query = `${query} LIMIT 1;`
    const { rows } = await db.query(query, Object.values(dataQuery));
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
        tasks.list_posts AS list_posts,
        tasks.description AS description
        FROM task_user
        JOIN tasks ON task_user.task_id = tasks.id) AS R
      WHERE user_id=${user_id} and status=true
    `);
    return rows;
  },
  async listTaskDoneByUserByLatestTurnUnique(user_id) {
    const { rows } = await db.query(sql`
    SELECT *
    FROM (SELECT task_user.task_id AS task_id,
        task_user.user_id AS user_id ,
        task_user.status AS status,
        task_user.turn AS turn,
        tasks.name AS name,
        tasks.reward AS reward,
        tasks.list_posts AS list_posts,
        tasks.description AS description
        FROM task_user
        JOIN tasks ON task_user.task_id = tasks.id) AS R
      WHERE user_id=${user_id} and status=true
    `);
    return rows;
  },
  async updateStatusTrue(id) {
    try {
      const { rows } = await db.query(sql`
      UPDATE task_user
      SET status=true
      WHERE id=${id}
      RETURNING *;
      `);

      const [task_user] = rows;
      return task_user;
    } catch (error) {
      return null;
    }
  },
  async deleteUserTask(id) {
    console.log("🚀 ~ file: task-user.js ~ line 125 ~ deleteUserTask ~ id", id)
    try {
      const { rows } = await db.query(sql`
      DELETE FROM task_user
      WHERE id=${id}
      RETURNING *;
      `);
      console.log("🚀 ~ file: task-user.js ~ line 131 ~ deleteUserTask ~ rows", rows)

      const [task_user] = rows;
      return task_user;
    } catch (error) {
      return null;
    }
  },
};
