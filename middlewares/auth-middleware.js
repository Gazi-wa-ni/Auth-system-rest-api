const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')

const checkAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1];
      const user = await jwt.verify(token, process.env.SECRET_KEY);
      const userId = user.userId;
      req.user = await userModel.findById(userId).select('-password')
      next()
    } catch (error) {
      console.log(error);
      res.status(401).json({
        msg: "unauthorized user"
      })
    }
  }
  if (!token) {
    res.status(401).json({
      msg: "unauthorized user"
    })
  }
}

module.exports = checkAuth;