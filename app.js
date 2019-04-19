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

// On injecte les models dans les routers
app.use('/v1/users', usersRouter(usersModel))
app.use('/v1/auth', authRouter(idpModel))

// For unit tests
exports.app = app