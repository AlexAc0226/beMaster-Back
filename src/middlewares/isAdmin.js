const createHttpError = require('http-errors');

const isAdmin = async (req, res, next) => {
  try {
    const isAdmin  = req.user.isAdmin

    if (isAdmin === false ) {
      return res.status(401).send('[Unauthorized - User] - [Access - Denied]');
    }
    return next();
  } catch (error) {
    const httpError = createHttpError(
      error.statusCode = 401,
      `[Unauthorized - User] - [Access - Denied]: ${error.message}`,
    );
    return next(httpError);
  }
};

module.exports = isAdmin
