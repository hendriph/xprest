module.exports = (req, res, next) => {
  res.success = (data, status = 200) => {
    res.status(status).json({
      success: true,
      data
    });
  };
  next();
};
