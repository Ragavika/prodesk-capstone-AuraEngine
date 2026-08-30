const express = require("express");
const router = express.Router();

const {
  getInventory,
  createProduct,
  updateProduct,
} = require("../controllers/inventoryController");

const validateProduct = require("../middleware/validateProduct");
const { productSchema } = require("../validators/productValidator");

router.get("/", getInventory);

router.post(
  "/",
  validateProduct(productSchema),
  createProduct
);

router.put(
  "/:id",
  validateProduct(productSchema),
  updateProduct
);

module.exports = router;