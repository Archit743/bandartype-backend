const jwt = require('jsonwebtoken')
const UserSecret = process.env.USER_SECRET

function auth(req, res, next) {
  const token = req.headers.token;
  const responce = jwt.verify(token, UserSecret)
  if (responce) {
    req.email = responce.email;
    next()
  }
  else {
    res.status(403).json({
      message: "auth error"
    })
  }

}
module.exports = {
  UserSecret,
  auth,
  jwt
}
