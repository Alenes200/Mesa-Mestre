const bcrypt = require('bcrypt');

async function comparePassword(password, hashedPassword) {
  console.log('→ comparePassword recebeu:', { password, hashedPassword });

  if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
    console.error('!! comparePassword: args inválidos (não são strings)');
    return false;
  }

  try {
    const result = await bcrypt.compare(password, hashedPassword);
    console.log('→ bcrypt.compare result:', result);
    return result;
  } catch (err) {
    console.error('!! bcrypt.compare disparou erro:', err);
    return false;
  }
}

module.exports = comparePassword;
