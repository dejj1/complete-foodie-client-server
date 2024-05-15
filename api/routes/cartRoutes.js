const express = require('express');
const Carts = require('../models/Carts');
const router = express.Router();

const cartController = require('../controllers/cartControllers')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, cartController.getCartsByEmail)
router.post('/', cartController.addToCart)
router.delete('/:id', cartController.deleteCart)
router.put('/:id', cartController.updateCart)
router.get('/:id', cartController.getSingleCart)

module.exports = router;