const { HTTP_STATUS } = require("../constants/api.constants");
const ProductsMongoDao  = require("../models/daos/products.mongo.dao");
const { successResponse } = require("../utils/api.utils");

const productsMongoDao = new ProductsMongoDao();

class ProductsController {

  async getProducts(req, res, next) {
    try {
      const products = await productsMongoDao.getAll();
      const response = successResponse(products);
      res.status(HTTP_STATUS.OK).json(response);
    }
    catch(error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await productsMongoDao.getById(id);
      const response = successResponse(product);
      res.status(HTTP_STATUS.OK).json(response);
    }
    catch(error) {
      next(error);
    }
  }

  async saveProduct(req, res, next) {
    try {
      const newProduct = await productsMongoDao.save(req.body);
      const response = successResponse(newProduct);
      res.status(HTTP_STATUS.CREATED).json(response);
    }
    catch(error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    const { id } = req.params;
    try {
      const updateProduct = await productsMongoDao.update(id, req.body);
      const response = successResponse(updateProduct);
      res.status(HTTP_STATUS.OK).json(response);
    }
    catch(error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const deletedProduct = await productsMongoDao.delete(id);
      const response = successResponse(deletedProduct);
      res.status(HTTP_STATUS.OK).json(response);
    }
    catch(error) {
      next(error);
    }
  }
}

module.exports = new ProductsController();