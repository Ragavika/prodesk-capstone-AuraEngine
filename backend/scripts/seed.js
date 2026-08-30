require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Product = require("../src/models/Product");

const TOTAL_PRODUCTS = 50000;
const BATCH_SIZE = 1000;

const categories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Home Appliances",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
  "Grocery",
];

const generateProduct = (index) => {
  const cost = Number(faker.commerce.price({ min: 5, max: 1000 }));
  const markup = faker.number.float({
    min: 1.05,
    max: 1.8,
    fractionDigits: 2,
  });

  const price = Number((cost * markup).toFixed(2));

  return {
    productName: faker.commerce.productName(),
    sku: `AURA-${String(index + 1).padStart(6, "0")}`,
    category: faker.helpers.arrayElement(categories),
    price,
    cost,
    stockQuantity: faker.number.int({
      min: 0,
      max: 1000,
    }),
    reorderLevel: faker.number.int({
      min: 10,
      max: 100,
    }),
    lastUpdated: faker.date.recent({
      days: 30,
    }),
  };
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingCount = await Product.countDocuments();

    console.log(`Existing products: ${existingCount}`);

    if (existingCount > 0) {
      console.log(
        "Products already exist. Seeder stopped to prevent duplicate data."
      );

      await mongoose.disconnect();
      return;
    }

    const startTime = Date.now();

    for (let start = 0; start < TOTAL_PRODUCTS; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE, TOTAL_PRODUCTS);

      const products = [];

      for (let i = start; i < end; i++) {
        products.push(generateProduct(i));
      }

      await Product.insertMany(products, {
        ordered: false,
      });

      console.log(`Inserted ${end}/${TOTAL_PRODUCTS} products`);
    }

    const endTime = Date.now();

    const finalCount = await Product.countDocuments();

    console.log("=================================");
    console.log("Seeding completed successfully");
    console.log(`Total products: ${finalCount}`);
    console.log(
      `Time taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds`
    );
    console.log("=================================");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProducts();