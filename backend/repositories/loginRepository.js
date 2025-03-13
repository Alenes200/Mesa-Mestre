const client = require('../db/postgresql');

const loginRepository = {
  getUserByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);
    return result.rows[0];
  },
};

module.exports = loginRepository;
