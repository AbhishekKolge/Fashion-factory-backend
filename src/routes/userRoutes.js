const express = require("express");

const {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserStatus,
  removeUser,
} = require("../controllers/userController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateUserStatusSchema,
} = require("../validation/user");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router.route("/show-me").get(authenticateUserMiddleware, showCurrentUser);
router
  .route("/profile-image")
  .post(
    [
      authenticateUserMiddleware,
      testUserMiddleware,
      uploadProfileImageSchema,
      validateRequest,
    ],
    uploadProfileImage
  )
  .delete(
    [
      authenticateUserMiddleware,
      testUserMiddleware,
      removeProfileImageSchema,
      validateRequest,
    ],
    removeProfileImage
  );
router
  .route("/")
  .get(
    [authenticateUserMiddleware, authorizePermissionsMiddleware("ADMIN")],
    getAllUsers
  )
  .patch(
    [
      authenticateUserMiddleware,
      testUserMiddleware,
      updateUserSchema,
      validateRequest,
    ],
    updateUser
  )
  .delete(
    [
      authenticateUserMiddleware,
      testUserMiddleware,
      deleteUserSchema,
      validateRequest,
    ],
    deleteUser
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateUserStatusSchema,
      validateRequest,
    ],
    updateUserStatus
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteUserSchema,
      validateRequest,
    ],
    removeUser
  );

module.exports = router;
