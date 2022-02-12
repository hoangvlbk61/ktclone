const sql = require("sql-template-strings");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = {
  async create({
    email,
    password,
    user_social_id,
    telephone,
    name,
    address,
    is_admin = false,
  }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await db.query(sql`
      INSERT INTO users (id, email, password, user_social_id, telephone, name, address, balance, is_admin)
        VALUES (${uuidv4()}, ${email}, ${hashedPassword},${user_social_id}, ${telephone}, ${name}, ${address}, 0, ${is_admin})
        RETURNING id, email;
      `);

      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === "users_email_key") {
        return null;
      }

      throw error;
    }
  },
  async update({ user_social_id, telephone, name, address, balance, id }) {
    const updateObj = { user_social_id, telephone, name, address, balance };
    Object.keys(updateObj).forEach((k) => {
      if (updateObj[k] === undefined || updateObj[k] === null)
        delete updateObj[k];
    });
    const val = [];
    const updateCondStr = Object.keys(updateObj).map((k, idx) => {
      val.push(updateObj[k]);
      return `${k}= $${idx + 1}`;
    }).join(", ");
    // const condLength = Object.keys(updateObj).length;
    // const updateCondArr = Object.keys(updateObj).map((k, idx) => {
    //   if (idx < condLength - 1) return sql`${k}=${updateObj[k]},`;
    //   return sql`${k}=${updateObj[k]}`;
    // });
    // const query = sql`UPDATE task_user SET `;
    // updateCondArr.forEach((s) => {
    //   query.append(s);
    // });
    let query = `UPDATE users SET ${updateCondStr} WHERE id=$${val.length + 1} RETURNING *`; 
    // if(user_social_id) query.append(sql`user_social_id=${user_social_id}, `);
    // if(telephone) query.append(sql`telephone=${telephone}, `);
    // if(name) query.append(sql`name=${name}, `);
    // if(address) query.append(sql`address=${address}, `);
    // if(balance) query.append(sql`balance=${balance},`);
    // query.append(sql`WHERE id=${id} RETURNING *`);
    try {
      const { rows } = await db.query(query, [...val, id]);

      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === "users_email_key") {
        return null;
      }

      throw error;
    }
  },
  async find(email) {
    const { rows } = await db.query(sql`
    SELECT * FROM users WHERE email=${email} LIMIT 1;
    `);
    return rows[0];
  },
  async findById(id) {
    const { rows } = await db.query(sql`
    SELECT * FROM users WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async list() {
    const { rows } = await db.query(sql`
    SELECT * FROM users ;
    `);
    return rows;
  },
  async deleteUser(id) {
    try {
      const { rows } = await db.query(sql`
      DELETE FROM users
      WHERE id=${id}
      RETURNING *;
      `);

      const [user] = rows;
      return user;
    } catch (error) {
      return null;
    }
  },
};
