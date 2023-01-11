const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
} = require("../validation/coupon");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/")
  .get(getAllCoupons)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      createCouponSchema,
      validateRequest,
    ],
    createCoupon
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateCouponSchema,
      validateRequest,
    ],
    updateCoupon
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteCouponSchema,
      validateRequest,
    ],
    deleteCoupon
  );

module.exports = router;
