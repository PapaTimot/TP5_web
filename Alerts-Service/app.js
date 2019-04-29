const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const alertsRouter = require('./routes/alerts-v1')
const alertsModel = require('./model/alerts')


const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

// On injecte le modèle dans le routeur
app.use('/v1/alerts', alertsRouter(alertsModel))

// For unit tests
exports.app = app