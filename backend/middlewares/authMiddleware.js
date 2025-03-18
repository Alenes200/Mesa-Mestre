const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
  const token = req.cookies.session_id;

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { ensureAuthenticated };
