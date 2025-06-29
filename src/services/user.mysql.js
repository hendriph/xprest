const User = require('@models/user.mysql');
const AppError = require('@utils/AppError');

exports.findAll = () => User.findAll();
exports.findById = (id) => User.findByPk(id);
exports.create = async (data) => {
  try {
    const user = await User.create(data);
    if (!user) {return false;}
    return user;
  } catch (error) {
    // console.log('err-create=', error.errors.map(e => e.message)[0]);
    throw new AppError(400, "BAD_REQUEST", error.errors.map(e => e.message)[0]);
  }
  
};
exports.update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError(400, "BAD_REQUEST", 'User not found');
  return await user.update(data);
};
exports.remove = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError(400, "BAD_REQUEST", 'User not found');
  await user.destroy();
  return true;
};