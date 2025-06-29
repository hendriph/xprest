const express = require('express');
const router = express.Router();
const authController = require('@controllers/auth.controller');
const validate = require('@middlewares/validate');
const { registerSchema, loginSchema, forgotSchema, resetSchema, refreshTokenSchema } = require('@validations/auth.validation');
const authenticate = require('@middlewares/authenticate');
const rateLimiter = require('@middlewares/rateLimiter');
const auditLog = require('@middlewares/auditLog');

router.post('/register', validate(registerSchema), auditLog('User registration'), authController.register);
// router.post('/login', validate(loginSchema), authController.login);
router.post('/login', rateLimiter({ windowMs: 10 * 60 * 1000, max: 5 }), validate(loginSchema), auditLog('User login attempt'), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), auditLog('Refresh token'), authController.refreshToken);
router.post('/forgot-password', validate(forgotSchema), auditLog('Forgot password'), authController.forgotPassword);
router.post('/reset-password', validate(resetSchema), auditLog('Reset password'), authController.resetPassword);
router.post('/logout', authenticate, auditLog('User logout'), authController.logout);

module.exports = router;
