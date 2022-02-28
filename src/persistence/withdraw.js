const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

// 0 = pending 
// 1 = finished
// 2 = cancel

module.exports = {
  async create(userId, status, amount) {
    const id = uuidv4();
    await db.query(sql`
    INSERT INTO withdraw (id, user_id, status, amount)
      VALUES (${id}, ${userId}, ${status}, ${amount});
    `);
    return id;
  },
  async update(id, status) {
    await db.query(sql`
    UPDATE withdraw
      SET status=${status}
      WHERE id=${id}
      RETURNING *;
    `);
    return id;
  },
  async list() {
    const {rows} = await db.query(sql`
    SELECT 
		  withdraw.id as withdraw_id, 
		  withdraw.user_id as user_id, 
		  status,
		  amount,
		  withdraw.created_at as created_at, 
		  withdraw.updated_at as updated_at,
		  users.email as email,
		  users.name as username
        FROM withdraw
        JOIN users ON withdraw.user_id = users.id
    `);
    if (rows.length !== 1) {
      return null;
    }
    return rows;
  },
  async listByStatus(status) {
    const {rows} = await db.query(sql`
      SELECT 
        withdraw.id as withdraw_id, 
        withdraw.user_id as user_id, 
        status,
        amount,
        withdraw.created_at as created_at, 
        withdraw.updated_at as updated_at,
        users.email as email,
        users.name as username
      FROM withdraw
      JOIN users ON withdraw.user_id = users.id
      WHERE user_id=${user_id} and status=${status}
    `);
    if (rows.length !== 1) {
      return null;
    }
    return rows;
  },
  async findById(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM withdraw WHERE id = ${id} LIMIT 1;
    `);
    if (rows.length !== 1) {
      return null;
    }

    const withdraw = rows[0];
    return withdraw;
  },
  async getListByUser(uid) {
    const {rows} = await db.query(sql`
    SELECT * FROM withdraw WHERE user_id = ${uid};
    `);
    return rows;
  },
  async delete(id) {
    await db.query(sql`
    DELETE FROM withdraw WHERE id = ${id};
    `);
  }
};
