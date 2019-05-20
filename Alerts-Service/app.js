const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const request = require("request");

const alertsRouter = require('./routes/alerts-v1')
const alertsModel = require('./model/alerts')



const app = express()

app.use(bodyParser.json())

// Activation de Helmet
app.use(helmet({noSniff: true}))

// connection à la bdd mongodb
if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config() // or mongodb://localhost/mybrary
}

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))


// Middleware d'authentification
app.use((req, res, next) => {
	if(req.url.includes("/v1/auth/login")){
		request.post({
			"headers": { "content-type": "application/json" },
			"url": "http://localhost:3000/v1/auth/login",
			"body": req.body
		}, (error, response, body) => {
			if(error) {
				return console.log(error);
			}
			console.log(JSON.parse(body));
		});
	}
	else if (req.url.includes("/v1/auth/verifyaccess")){
		request.post({
			"headers": { "content-type": "application/json" },
			"url": "http://localhost:3000/v1/auth/verifyaccess",
			"body": req.body
		}, (error, response, body) => {
			if(error) {
				return console.log(error);
			}
			console.log(JSON.parse(body));
		});
	}
    else{
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
})

// On injecte le modèle dans le routeur
app.use('/v1/alerts', alertsRouter(alertsModel))

// For unit tests
exports.app = app