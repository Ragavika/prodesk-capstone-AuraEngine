require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const measureQuery = async (name, query) => {
  const start = process.hrtime.bigint();

  await query;

  const end = process.hrtime.bigint();

  const durationMs = Number(end - start) / 1_000_000;

  console.log(`${name}: ${durationMs.toFixed(2)} ms`);
};

const testPerformance = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Running performance tests...\n");

    await measureQuery(
      "Basic pagination",
      Product.find()
        .skip(0)
        .limit(50)
        .lean()
    );

    await measureQuery(
      "Category filter",
      Product.find({ category: "Electronics" })
        .limit(50)
        .lean()
    );

    await measureQuery(
      "Price sorting",
      Product.find()
        .sort({ price: -1 })
        .limit(50)
        .lean()
    );

    await measureQuery(
      "Category + price sorting",
      Product.find({ category: "Electronics" })
        .sort({ price: -1 })
        .limit(50)
        .lean()
    );

    await measureQuery(
      "Product name search",
      Product.find({
        productName: {
          $regex: "computer",
          $options: "i",
        },
      })
        .limit(50)
        .lean()
    );

    await mongoose.disconnect();

    console.log("\nPerformance testing completed.");
  } catch (error) {
    console.error("Performance test failed:", error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
};

testPerformance();