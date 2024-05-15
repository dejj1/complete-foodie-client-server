const express = require('express')
const router = express.Router()

const userController = require('../controllers/userControllers')
const verifyToken = require('../middlewares/verifyToken')
const verifyAdmin = require('../middlewares/verifyAdmin')

router.get('/',  userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id',verifyToken, verifyAdmin, userController.deleteUser);
router.get('/admin/:email', verifyToken, userController.getAdmin);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);


module.exports = router