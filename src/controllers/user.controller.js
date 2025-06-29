const userService = require('../services/user.service');
const AppError = require('@utils/AppError');

exports.getAllUsers = async (req, res) => {
  const users = await userService.findAll();
  res.success(users);
};

exports.getUserById = async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new AppError(400, "BAD_REQUEST", 'User not found');
  res.success(user);
};

exports.createUser = async (req, res) => {
  const user = await userService.create(req.body);
  if (user.err) throw new Error(user.err);
  res.success(user, 201);
};

exports.updateUser = async (req, res) => {
  const updated = await userService.update(req.params.id, req.body);
  if (!updated) throw new AppError(400, "BAD_REQUEST", 'User not found');
  res.success(updated);
};

exports.deleteUser = async (req, res) => {
  const deleted = await userService.remove(req.params.id);
  if (!deleted) throw new Error('User not found');
  res.success({ message: 'User deleted' });
};