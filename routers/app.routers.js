const { Router } = require("express");
const productsRoutes = require('./products/products.routes');
const RandomNumbersController= require('../controllers/randomNumbers.controllers')


const router = Router();


router.use('/products', productsRoutes)
router.use('/randoms', RandomNumbersController.getRandoms)


module.exports = router;