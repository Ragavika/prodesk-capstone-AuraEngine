const Product = require("../models/Product");

const getInventory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 50, 1),
      100
    );

    const search = req.query.search?.trim();
    const category = req.query.category?.trim();
    const sort = req.query.sort;

    const filter = {};

    // Search by product name
    if (search) {
      filter.productName = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Allowed sorting fields
    const sortOptions = {};

    if (sort) {
      const sortDirection = sort.startsWith("-") ? -1 : 1;
      const sortField = sort.replace("-", "");

      const allowedSortFields = [
        "price",
        "cost",
        "stockQuantity",
        "productName",
        "lastUpdated",
      ];

      if (allowedSortFields.includes(sortField)) {
        sortOptions[sortField] = sortDirection;
      }
    }

    const skip = (page - 1) * limit;

    const [products, totalRecords] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      data: products,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching inventory:", error.message);

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "SKU already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

module.exports = {
  getInventory,
  createProduct,
  updateProduct,
};