const express = require('express');
const userController = require('../controller/userController.js');
const checkAuth = require('../middlewares/auth-middleware.js');
const router = express.Router();

// ....register
router.post('/register', userController.register);

// ....login
router.post('/login',  userController.login);

//....get user
router.get('/user',checkAuth,userController.getUser)

// ...send link
router.get('/sendLlink',userController.sendLink)

// ....reset passowrd by email
router.post('/resetPassword/:id/:token',userController.resetPassword)


module.exports = router;