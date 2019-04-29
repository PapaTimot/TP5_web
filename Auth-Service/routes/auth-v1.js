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


/* POST : try to get an access_token with a login and password  */
router.post('/login', function (req, res, next) {
  idpModel.getJWT(req.body)
  .then((token) => {
    res
    .status(200)
    .json({access_token : token, expirity : idpModel.getExpirity()})
  })
  .catch(() => {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "unauthorize user"})
  }) 
})
// curl -d '{"login": "pedro", "password": "tequila"}' 
//      -H "Content-Type: application/json" 
//      -X POST http://localhost:3000/v1/auth/login



/* GET a message to check if the access token in the header is VALID. */
router.get('/verifyaccess', function (req, res, next) {
  let token = null
  try {
    token = req.headers.authorization.split(" ")[1]
  } 
  catch (error) {
    res
    .status(401)
    .json({ code    : 0,
            type    : "authorization",
            message : "no access token"})
  }
  if (token){
    idpModel.checkJWT(token)
    .then(() => {
      res
        .status(200)
        .json({message : "valid access token"})
    })
    .catch(() => {
      res
      .status(401)
      .json({ code    : 0,
              type    : "authorization",
              message : "unvalid access token"})
    })
  }
})
// curl -H "authorization: bearer '$token' " 
// http://localhost:3000/v1/auth/verifyaccess


/** return a closure to initialize model */
module.exports = (model) => {
  idpModel = model
  return router
}
