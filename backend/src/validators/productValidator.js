const { z } = require("zod");

const productSchema = z
  .object({
    productName: z
      .string()
      .trim()
      .min(1, "Product name is required"),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required"),

    category: z
      .string()
      .trim()
      .min(1, "Category is required"),

    price: z
      .number()
      .nonnegative("Price cannot be negative"),

    cost: z
      .number()
      .nonnegative("Cost cannot be negative"),

    stockQuantity: z
      .number()
      .int("Stock quantity must be an integer")
      .nonnegative("Stock quantity cannot be negative"),

    reorderLevel: z
      .number()
      .int("Reorder level must be an integer")
      .nonnegative("Reorder level cannot be negative"),

    lastUpdated: z
      .coerce
      .date()
      .optional(),
  })
  .refine((data) => data.price >= data.cost, {
    message: "Price cannot be lower than cost",
    path: ["price"],
  });

module.exports = {
  productSchema,
};