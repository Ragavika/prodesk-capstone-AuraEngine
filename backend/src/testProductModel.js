require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const testProductModel = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    console.log("Product model loaded:", Product.modelName);
    
    await Product.createIndexes();
    const indexes = await Product.collection.indexes();

    console.log("Indexes:");
    console.log(indexes);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
};

testProductModel();