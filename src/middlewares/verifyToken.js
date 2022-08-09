require('dotenv').config();
const jwt = require("jsonwebtoken");

const TOKEN_KEY = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token === null) return res.status(401).send("Token requerido");

  jwt.verify(token, TOKEN_KEY, (err, user)=>{
      if(err) return res.status(403).send("Token invalido");
      req.user = user;
      next();
  });
}
module.exports = verifyToken;