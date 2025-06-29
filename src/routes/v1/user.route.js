const express = require('express');
const router = express.Router();
const authenticate = require('@middlewares/authenticate');
const authorize = require('@middlewares/authorize');
const validate = require('@middlewares/validate');
const { createSchema, updateSchema } = require('@validations/user.validation');
const userController = require('@controllers/user.controller');

router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.post('/', authenticate, authorize('admin'), validate(createSchema), userController.createUser);
router.put('/:id', authenticate, authorize('admin'), validate(updateSchema),userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);
router.get('/me', authenticate, (req, res) => {
  res.success({ ...req.user });
});

module.exports = router;