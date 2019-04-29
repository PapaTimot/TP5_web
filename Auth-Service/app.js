const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const usersRouter = require('./routes/users-v1')
const authRouter = require('./routes/auth-v1')
const usersModel = require('./model/users')
const idpModel = require('./model/idp')

const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

// Middleware d'authentification
app.use((req, res, next) => {    
    if(!req.url.includes("/v1/auth/login") && !req.url.includes("/v1/auth/verifyaccess")){
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
            idpModel(usersModel).checkJWT(token)
            .then(() => {
                next()
            })
            .catch(() => {
                res
                .status(401)
                .json({ code    : 0,
                    type    : "authorization",
                    message : "unvalid access token"})
            })
        }
    }
    else {
        next()
    }


})

// On injecte les modèles dans les routers
app.use('/v1/users', usersRouter(usersModel))
app.use('/v1/auth', authRouter(idpModel(usersModel)))

// For unit tests
exports.app = app