const express = require("express");

const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  authenticateUserMiddleware,
  authorizePermissionsMiddleware,
} = require("../middleware/authentication");
const {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} = require("../validation/category");
const { validateRequest } = require("../middleware/validate-request");
const { testUserMiddleware } = require("../middleware/test-user");

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      createCategorySchema,
      validateRequest,
    ],
    createCategory
  );

router
  .route("/:id")
  .patch(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      updateCategorySchema,
      validateRequest,
    ],
    updateCategory
  )
  .delete(
    [
      authenticateUserMiddleware,
      authorizePermissionsMiddleware("ADMIN"),
      testUserMiddleware,
      deleteCategorySchema,
      validateRequest,
    ],
    deleteCategory
  );

module.exports = router;
