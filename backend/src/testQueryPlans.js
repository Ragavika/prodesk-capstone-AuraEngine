require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const testQueryPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected\n");

    const categoryPlan = await Product.find({
      category: "Electronics",
    })
      .limit(50)
      .explain("executionStats");

    console.log("=== CATEGORY QUERY ===");
    console.log({
      executionTimeMillis:
        categoryPlan.executionStats.executionTimeMillis,

      totalDocsExamined:
        categoryPlan.executionStats.totalDocsExamined,

      totalKeysExamined:
        categoryPlan.executionStats.totalKeysExamined,

      nReturned:
        categoryPlan.executionStats.nReturned,
    });

    const productNamePlan = await Product.find({
      productName: {
        $regex: "computer",
        $options: "i",
      },
    })
      .limit(50)
      .explain("executionStats");

    console.log("\n=== PRODUCT NAME SEARCH ===");
    console.log({
      executionTimeMillis:
        productNamePlan.executionStats.executionTimeMillis,

      totalDocsExamined:
        productNamePlan.executionStats.totalDocsExamined,

      totalKeysExamined:
        productNamePlan.executionStats.totalKeysExamined,

      nReturned:
        productNamePlan.executionStats.nReturned,
    });

    const pricePlan = await Product.find()
      .sort({ price: -1 })
      .limit(50)
      .explain("executionStats");

    console.log("\n=== PRICE SORT ===");
    console.log({
      executionTimeMillis:
        pricePlan.executionStats.executionTimeMillis,

      totalDocsExamined:
        pricePlan.executionStats.totalDocsExamined,

      totalKeysExamined:
        pricePlan.executionStats.totalKeysExamined,

      nReturned:
        pricePlan.executionStats.nReturned,
    });

    await mongoose.disconnect();

    console.log("\nQuery plan testing completed.");
  } catch (error) {
    console.error("Query plan test failed:", error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
};

testQueryPlans();