const authService = require('@services/auth.service');
const { queueEmail } = require('@queues/jobs/email.job');

exports.register = async (req, res) => {
  const newUser = await authService.register(req.body);
  queueEmail({
    to: newUser.email,
    subject: 'Welcome to Xprest!',
    template: 'welcome',
    data: { name: newUser.name },
  });
  res.success(newUser, 201);
};

exports.login = async (req, res) => {
  const tokens = await authService.login(req.body);
  res.success(tokens);
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  const data = await authService.refreshToken(token);
  res.success(data);
};

exports.logout = async (req, res) => {
  const user = req.user;
  await authService.logout(user.sub);
  res.status(204).send();
};

exports.forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.success({ message: 'Reset token sent to email' });
};

exports.resetPassword = async (req, res) => {
  await authService.resetPassword(req.body);
  res.success({ message: 'Password updated' });
};
