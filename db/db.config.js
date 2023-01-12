const envConfig = require('../config');


module.exports = {
  mongodb: {
    uri: `mongodb+srv://lemosadrian08:${envConfig.DB_PASSWORD}@cluster0.gs1l0ic.mongodb.net/?retryWrites=true&w=majority`
  },
}


