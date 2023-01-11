const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
} = require("../validation/review");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/:productId")
  .get(getProductReviews)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("BASIC"),
      testUserMiddleware,
      createReviewSchema,
      validateRequest,
    ],
    createReview
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("BASIC"),
      testUserMiddleware,
      updateReviewSchema,
      validateRequest,
    ],
    updateReview
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("BASIC", "ADMIN"),
      testUserMiddleware,
      deleteReviewSchema,
      validateRequest,
    ],
    deleteReview
  );

module.exports = router;
