const AppError = require('@utils/AppError');

module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new AppError(403, "FORBIDDEN", 'Access denied (no user or role)');
    }

    const userRole = typeof user.role === 'object' ? user.role.name : user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError(403, "FORBIDDEN", `Forbidden for role: ${userRole}`);
    }

    next();
  };
};
