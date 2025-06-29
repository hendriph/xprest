const jwt = require('jsonwebtoken');

const accessExpired = `${process.env.JWT_ACCESS_EXPIRED}${process.env.JWT_ACCESS_EXPIRED_FORMAT}`;
const refreshExpired = `${process.env.JWT_REFRESH_EXPIRED}${process.env.JWT_REFRESH_EXPIRED_FORMAT}`;

exports.generateAccessToken = (userId, email, role) => jwt.sign({ sub: userId, email, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: accessExpired });
exports.generateRefreshToken = (userId, email, role) => jwt.sign({ sub: userId, email, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpired });
