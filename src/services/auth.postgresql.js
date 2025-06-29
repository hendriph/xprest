const {bcrypt} = require('../utils/hash');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const { sendMail } = require('@utils/mailer');
const { v4: uuidv4 } = require('uuid');
const Authentication = require('@models/auth.model');
const User = require('@models/user.model');
const Role = require('@models/role.model');
const {generateAccessToken, generateRefreshToken} = require('@utils/token');
const {authLogs} = require('@utils/logger');
const tokenStore = require('@utils/cache/token.redis');
const resetStore = require('@utils/cache/reset.redis');
const AppError = require('@utils/AppError');

exports.register = async ({ email, password, fullname, role }) => {
  const existing = await Authentication.findOne({ where: { email } });
  if (existing) throw new AppError(400, "BAD_REQUEST", 'Email is already registered');
  const hashed = await bcrypt.hash(password, 10);
  const auth = await Authentication.create({ email, password: hashed });
  await User.create({ email, fullname, role_id: role });
  authLogs.info(`User created (${fullname}, ${email}, role = ${role})`);
  return { id: auth.id, email: auth.email, name: fullname };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ 
    where: { email },
    attributes: [
    'id', 'email', 'fullname', 'phone', [Sequelize.col('role.name'), 'role']
    ],
    include: [{
      model: Role,
      as: 'role',
      attributes: [],
      required: true
    }],
    raw: true
  });
  if (!user) { throw new AppError(400, "BAD_REQUEST", 'Email is not found'); }
  const auth = await Authentication.findOne({ where: { email } });
  if (!auth || !(await bcrypt.compare(password, auth.password))) {
    throw new AppError(400, "BAD_REQUEST", 'Invalid email or password');
  }
  const accessToken = generateAccessToken(auth.id, user.email, user.role);
  const refreshToken = generateRefreshToken(auth.id, user.email, user.role);
  await tokenStore.storeRefreshToken(auth.id, refreshToken);
  return { accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const auth = await Authentication.findByPk(payload.sub);
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'User is not found');
  const stored = await tokenStore.getRefreshToken(auth.id);
  if (!stored || stored !== token) throw new AppError(400, "BAD_REQUEST", 'Invalid token');
  return { accessToken: generateAccessToken(auth.id, payload.email, payload.role) };
};

exports.logout = async (userId) => {
  const auth = await Authentication.findByPk(userId);
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'Failed Logout. Invalid user login.');
  await tokenStore.revokeRefreshToken(auth.id);
};

exports.forgotPassword = async (email) => {
  const auth = await Authentication.findOne({ where: { email } });
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'Email is not registered');
  const token = uuidv4();
  await resetStore.setResetToken(auth.id, token);
  authLogs.info(`[RESET] Send token ${token} to email: ${email}`);
  await sendMail({
    to: email,
    subject: 'Reset Password',
    html: `<p>Your reset token is: <b>${token}</b></p>`
  });
};

exports.resetPassword = async ({ email, token, password }) => {
  const auth = await Authentication.findOne({ where: { email } });
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'User is not found');
  const storedToken = await resetStore.getResetToken(auth.id);
  if (!storedToken || storedToken !== token) throw new AppError(400, "BAD_REQUEST", 'Invalid or expired token');
  const hashed = await bcrypt.hash(password, 10);
  auth.password = hashed;
  await auth.save();
  await resetStore.clearResetToken(auth.id);
};