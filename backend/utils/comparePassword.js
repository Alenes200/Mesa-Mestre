const bcrypt = require('bcrypt');

async function comparePassword(password, hashedPassword) {
  if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }

  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (err) {
    return false;
  }
}

module.exports = comparePassword;
