const User = require('@models/user.mongo');
const AppError = require('@utils/AppError');

exports.findAll = () => User.find();
exports.findById = (id) => User.findById(id);
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
  const user = await User.findByIdAndUpdate(id, data);
  if (!user) throw new AppError(400, "BAD_REQUEST", 'User not found');
  return user;
};
exports.remove = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError(400, "BAD_REQUEST", 'User not found');
  return true;
};