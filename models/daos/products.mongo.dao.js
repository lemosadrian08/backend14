const MongoContainer = require("../containers/mongo.container");
const productsSchema = require("../schemas/products.schema")

const collection = "products";


class ProductsMongoDao extends MongoContainer {
  constructor() {
    super(collection, productsSchema);
  }
}

module.exports= ProductsMongoDao