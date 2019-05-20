const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const config = require('config')

const alertsRouter = require('./routes/alerts-v1')
const alertsModel = require('./model/alerts')



const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

// connection à la bdd mongodb Atlas
// if(process.env.NODE_ENV !== 'production'){
// 	require('dotenv').config() // or mongodb://localhost/mybrary
// }

const { mongoDBAtlas, username, password, host, port, dbName } = config.get('dbConfig')

let db_url = ''
if(mongoDBAtlas){
	db_url = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true`
}
else {
	db_url = `mongodb://${username}:${password}@${host}:${port}/${dbName}?retryWrites=true`
}

mongoose.set('useFindAndModify', false);
mongoose.connect(db_url, {
	useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))

// On injecte le modèle dans le routeur

app.use('/v1/alerts', alertsRouter(alertsModel))

// For unit tests
exports.app = app