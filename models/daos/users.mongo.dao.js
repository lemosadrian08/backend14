const MongoContainer = require("../containers/mongo.container");
const usersSchema = require('../schemas/users.schema')


const collection = "users";


class UsersMongoDao extends MongoContainer {
  constructor() {
    super(collection, usersSchema);
  }


  async getByUsername(username) {
    const document = await this.model.findOne({ username }, { __v: 0 });
    if (!document) {
      return null
    }
    return document;
  }



}

module.exports= UsersMongoDao