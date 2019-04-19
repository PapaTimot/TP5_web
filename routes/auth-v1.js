const express = require('express')
const router = express.Router()

let idpModel = undefined

/* Control idpmodel initialisation */
router.use((req, res, next) => {
  /* istanbul ignore if */
  if (!idpModel) {
    res
      .status(500)
      .json({message: 'model not initialised'})
  }
  next()
})



/* GET a message to check if the access token in the header is VALID. */
router.get('/verifyaccess', function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1]
  if (idpModel.checkJWT(token)){
    res
      .status(200)
      .json({message : "valid access token"})
  }
  else {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "unvalid access token"})
  }
})
// curl -H "authorization: bearer '$token' " 
// http://localhost:3000/v1/auth/verifyaccess

/* POST : try to get an access_token with a login and password  */
router.post('/login', function (req, res, next) {
  const token = idpModel.getJWT(req.body)
  if (!token) {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "unauthorize user"})
  } 
  else {
    res
    .status(200)
    .json({access_token : token, expirity : idpModel.getExpirity()})
  }
})
// curl -d '{"login": "pedro", "password": "tequila"}' 
//      -H "Content-Type: application/json" 
//      -X POST http://localhost:3000/v1/auth/login


/** return a closure to initialize model */
module.exports = (model) => {
  idpModel = model
  return router
}