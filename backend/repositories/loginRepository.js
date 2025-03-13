const client = require('../db/postgresql');
const hashPassword = require('../utils/hashPassword');

// async function createUser() {
//   const nome = 'Admin';
//   const email = 'admin@example.com';
//   const password = await hashPassword('senha123');
//   const userType = 1;
//   const status = 1;

//   const query = `
//     INSERT INTO test_users (nome, email, password, user_type, status)
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING *;
//   `;

//   const result = await client.query(query, [nome, email, password, userType, status]);
//   console.log('Usuário criado:', result.rows[0]);
// }

// createUser();

const loginRepository = {
  getUserByEmail: async (email) => {
    const query = 'SELECT * FROM test_users WHERE email = $1';
    const result = await client.query(query, [email]);
    return result.rows[0];
  },
};

module.exports = loginRepository;
