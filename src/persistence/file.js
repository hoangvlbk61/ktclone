const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  async create(uuid, userId, ext) {
    await db.query(sql`
    INSERT INTO image (id, user_id, ext)
      VALUES (${uuid}, ${userId}, ${ext});
    `);
    return uuid;
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM image WHERE id = ${id} LIMIT 1;
    `);
    if (rows.length !== 1) {
      return null;
    }

    return rows[0];
  },
  async delete(id) {
    await db.query(sql`
    DELETE FROM image WHERE id = ${id};
    `);
  }
};
