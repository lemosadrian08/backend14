const auth = async (req, res, next) => {
  console.log("inside auth");
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
};

module.exports = auth;