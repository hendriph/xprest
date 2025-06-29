const {bcrypt} = require('@utils/hash');
const jwt = require('jsonwebtoken');
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
  const existing = await Authentication.findOne({ email });
  if (existing) throw new AppError(400, "BAD_REQUEST", 'Email is already registered');
  const hashed = await bcrypt.hash(password, 10);
  const auth = await Authentication.create({ email, password: hashed });
  await User.create({ email, fullname, role: role });
  authLogs.info(`User created (${fullname}, ${email}, role = ${role})`);
  return { id: auth._id, email: auth.email, name: fullname };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  .populate({
    path: 'role',
    select: 'name -_id' // ambil field name saja, tanpa _id
  })
  .lean();

  if (user && user.role) {
    user.role = user.role.name; // convert dari { name: 'admin' } ke 'admin' biar sama kayak SQL version
  } else {
    throw new AppError(400, "BAD_REQUEST", 'Email is not found');
  }
  const auth = await Authentication.findOne({ email });
  if (!auth || !(await bcrypt.compare(password, auth.password))) {
    throw new AppError(400, "BAD_REQUEST", 'Invalid email or password');
  }
  const accessToken = generateAccessToken(auth._id, user.email, user.role);
  const refreshToken = generateRefreshToken(auth._id, user.email, user.role);
  await tokenStore.storeRefreshToken(auth._id, refreshToken);
  return { accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const auth = await Authentication.findById(payload.sub);
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'User is not found');
  const stored = await tokenStore.getRefreshToken(auth._id);
  if (!stored || stored !== token) throw new AppError(400, "BAD_REQUEST", 'Invalid token');
  return { accessToken: generateAccessToken(auth._id) };
};

exports.logout = async (userId) => {
  const auth = await Authentication.findById(userId);
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'Failed Logout. Invalid user login.');
  await tokenStore.revokeRefreshToken(userId);
};

exports.forgotPassword = async (email) => {
  const auth = await Authentication.findOne({ email });
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'Email not registered');
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
  const auth = await Authentication.findOne({ email });
  if (!auth) throw new AppError(400, "BAD_REQUEST", 'User not found');
  const storedToken = await resetStore.getResetToken(auth.id);
  if (!storedToken || storedToken !== token) throw new AppError(400, "BAD_REQUEST", 'Invalid or expired token');
  const hashed = await bcrypt.hash(password, 10);
  auth.password = hashed;
  await auth.save();
  await resetStore.clearResetToken(auth.id);
};
