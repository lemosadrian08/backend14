const { Router } = require("express");
const auth = require('../../middlewares/auth');
const path =require('path');
const passport =require('../../middlewares/passport')
const ProcessInfoController= require('../../controllers/processInfo.controller')
const compression = require('compression')

const router = Router();

router.get('/', async (req, res) => {
  const user = req.user;
    if (user) {
      return res.redirect('/main');
    }
    else {
      return res.sendFile(path.resolve(__dirname,'../../public/login.html'));
    }
  });

router.get('/main', auth, async (req, res) => {
    const user = await req.user;
    console.log(user);
    res.render('index', { sessionUser: user.username ,logout: false});
  });

router.get('/logout', auth, async (req, res) => {
    const user = await req.user;
    try {
      req.session.destroy(err => {
        if (err) {
          console.log(err);
          res.clearCookie('my-session');
          res.redirect('/')
        }
        else {
          res.clearCookie('my-session');
          res.render('index', { sessionUser: user.username ,logout: true});
        }
      })
    }
    catch(err) {
      console.log(err);
    }
  });

router.post('/logIn',
  passport.authenticate('logIn', {
    failureRedirect: '/logIn-error',
    successRedirect: '/'
    })
  );

router.post('/signUp',
    passport.authenticate('signUp', { 
        failureRedirect: '/signUp-error',
        successRedirect: '/logIn'
      })
  );
  
router.get('/unauthorized', (req, res) => {
  res.status(401).sendFile(path.resolve(__dirname,'../../public/unauthorized.html'));
});

router.get('/error', (req, res) => {
  res.status(500).sendFile(path.resolve(__dirname,'../../public/error.html'));
});

router.get('/signUp', (req, res) => {
    return res.sendFile(path.resolve(__dirname,'../../public/register.html'));
  });

router.get('/signup-error', (req, res) => {
    return res.sendFile(path.resolve(__dirname,'../../public/signUp-error.html'));
  });

router.get('/logIn-error', (req, res) => {
    return res.sendFile(path.resolve(__dirname,'../../public/logIn-error.html'));
  });

router.get('/logIn', (req, res) => {
    return res.sendFile(path.resolve(__dirname,'../../public/login.html'));
  });

router.get('/info', compression(), ProcessInfoController.processInfoC)


module.exports = router;

