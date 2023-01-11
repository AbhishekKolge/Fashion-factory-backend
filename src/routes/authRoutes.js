const express = require("express");

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  logout,
  adminLogin,
  adminRegister,
} = require("../controllers/authController");
const { authenticateUserMiddleware } = require("../middleware/authentication");
const {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
  logoutSchema,
} = require("../validation/auth");
const { validateRequest } = require("../middleware/validate-request");

const router = express.Router();

router.route("/register").post([registerSchema, validateRequest], register);
router
  .route("/admin/register")
  .post([registerSchema, validateRequest], adminRegister);
router.route("/verify").post([verifySchema, validateRequest], verify);
router
  .route("/forgot-password")
  .post([forgotPasswordSchema, validateRequest], forgotPassword);
router
  .route("/reset-password")
  .post([resetPasswordSchema, validateRequest], resetPassword);
router.route("/login").post([loginSchema, validateRequest], login);
router.route("/admin/login").post([loginSchema, validateRequest], adminLogin);
router
  .route("/logout")
  .delete([authenticateUserMiddleware, logoutSchema, validateRequest], logout);

module.exports = router;
