const express = require("express");

const {
  createSize,
  getAllSizes,
  updateSize,
  deleteSize,
} = require("../controllers/sizeController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createSizeSchema,
  updateSizeSchema,
  deleteSizeSchema,
} = require("../validation/size");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/")
  .get(getAllSizes)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      createSizeSchema,
      validateRequest,
    ],
    createSize
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateSizeSchema,
      validateRequest,
    ],
    updateSize
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteSizeSchema,
      validateRequest,
    ],
    deleteSize
  );

module.exports = router;
