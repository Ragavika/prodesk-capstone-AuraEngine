const Product = require("../models/Product");

const getAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalValuation: {
            $sum: {
              $multiply: ["$price", "$stockQuantity"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalValuation: {
            $round: ["$totalValuation", 2],
          },
        },
      },
      {
        $sort: {
          totalValuation: -1,
        },
      },
    ]);

    res.status(200).json({
      data: analytics,
    });
  } catch (error) {
    console.error("Error generating analytics:", error.message);

    res.status(500).json({
      message: "Failed to generate analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};