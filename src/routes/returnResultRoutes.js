const express = require("express");

const {
  createReturnReason,
  getAllReturnReasons,
  updateReturnReason,
  deleteReturnReason,
} = require("../controllers/returnReasonController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createReturnReasonSchema,
  updateReturnReasonSchema,
  deleteReturnReasonSchema,
} = require("../validation/returnReason");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/")
  .get(getAllReturnReasons)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      createReturnReasonSchema,
      validateRequest,
    ],
    createReturnReason
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateReturnReasonSchema,
      validateRequest,
    ],
    updateReturnReason
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteReturnReasonSchema,
      validateRequest,
    ],
    deleteReturnReason
  );

module.exports = router;
