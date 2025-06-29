const AppError = require('@utils/AppError');

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) throw new AppError(400, "BAD_REQUEST", error.details[0].message);
    next();
  };
};
