require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const count = await Product.countDocuments();

    console.log(`Total products: ${count}`);

    const sampleProducts = await Product.find()
      .limit(3)
      .select("-__v");

    console.log("Sample products:");
    console.log(sampleProducts);

    const indexes = await Product.collection.indexes();

    console.log("Indexes:");
    console.log(indexes);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Database test failed:", error.message);
    process.exit(1);
  }
};

testDatabase();