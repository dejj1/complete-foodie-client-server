const express = require("express");
const router = express.Router();

// import model
const User = require("../models/User");
const Menu = require("../models/Menu");
const Payment = require("../models/Payments");

// middleware
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// get all orders stats
router.get("/", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: '$menuItems',
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'menuItems',
          foreignField: '_id',
          as: 'menuItemDetails',
        },
      },
      {
        $unwind: '$menuItemDetails',
      },
      {
        $group: {
          _id: '$menuItemDetails.category',
          quantity: { $sum: '$quantity' },
          revenue: { $sum: '$price' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          quantity: '$quantity',
          revenue: '$revenue',
        },
      },
    ]);

    res.json(result)
  } catch (error) {
    res.status(500).send("Internal server error " + error.message);
  }
});

module.exports = router;
