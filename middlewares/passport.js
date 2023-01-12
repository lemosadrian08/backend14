const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const UsersMongoDao = require('../models/daos/users.mongo.dao');
/* const { formatUserForDB } = require('../utils/users.utils');
const usersSchema = require('../models/schemas/users.schema'); */

const userMongoDao = new UsersMongoDao();

const salt = () => bcrypt.genSaltSync(10);
const createHash = (password) => bcrypt.hashSync(password, salt());
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

// Passport Local Strategy

// sign up
passport.use('signUp', new LocalStrategy(
  async (username, password, done) => {
  try {
    if(await userMongoDao.getByUsername(username)) return done(null,false)
    const newUser = {
      username,
      password: createHash(password)
    };
    await userMongoDao.save(newUser)
    const userMongo = await userMongoDao.getByUsername(newUser.username)
    console.log("User registration successfull");
    return done(null, userMongo);
  }
  catch(error) {
    console.log("Error signing user up...");
    console.log(error);
    return done(error);
  }
}));

// log in
passport.use('logIn', new LocalStrategy( 
  async (username, password, done) => {
  try {
    if(!await userMongoDao.getByUsername(username)) return done(null,false)
    const user = await userMongoDao.getByUsername(username);
    if (!isValidPassword(user, password)) {
      console.log("Invalid user or password");
      return done(null, false);
    }
    return done(null, user);
  }
  catch(error) {
    console.log("Error signing in...");
    console.log(error);
    return done(error);
  }
}))

// Serialization
passport.serializeUser((user, done) => {
  console.log("inside serialize");
  done(null, user._id);
})

// Deserialization
passport.deserializeUser(async (id, done) => {
  console.log("inside deserialize");
  const user = await userMongoDao.getById(id);
  done(null, user);
})

module.exports = passport;