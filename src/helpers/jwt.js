const jwt = require('jsonwebtoken')

exports.createJWT = (body) => {
  const { id, user_name, rol } = body
  const payload = {
    id,
    user_name,
    rol,
  }
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '3h',
  })
  return token
};

exports.validateJWT = async (token) => jwt.verify(token, process.env.JWT_KEY)

exports.decryptJWT = (header) => {
  const token = header.authorization
  try {
    const { id, user_name, rol } = jwt.verify(token, process.env.JWT_KEY)
    return {
      id,
      user_name,
      rol,
    }
  } catch (error) {
    const message = `[Token not provided or invalid] - [Access - Denied]: ${error.message}`
    return message
  }
};

exports.decodeJWT = (header) => {
  const token = header.authorization
  const { id, user_name, rol } = jwt.decode(token)
  return {
    id,
    user_name,
    rol,
  }
};
