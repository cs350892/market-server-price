const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { authMiddleware, adminMiddleware } =
  require("../middleware/auth.middleware").default;

// Public routes (for users)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/calculate-price", productController.calculatePrice);

// Admin routes (protected with auth middleware)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
