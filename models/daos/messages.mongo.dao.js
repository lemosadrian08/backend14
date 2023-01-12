const MongoContainer = require("../containers/mongo.container");
const messagesSchema = require('../schemas/messages.schema')


const collection = "messages";


class MessagesMongoDao extends MongoContainer {
  constructor() {
    super(collection, messagesSchema);
  }
}

module.exports= MessagesMongoDao