const express = require("express");

const {
  createProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require("../validation/product");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      createProductSchema,
      validateRequest,
    ],
    createProduct
  );

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateProductSchema,
      validateRequest,
    ],
    updateProduct
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteProductSchema,
      validateRequest,
    ],
    deleteProduct
  );

module.exports = router;
