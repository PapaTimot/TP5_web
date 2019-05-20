const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const request = require("request")
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


// Middleware d'authentification
app.use((req, res, next) => {
	if(req.url.includes("/v1/auth/login")){
		request.post({
			"headers": { "content-type": "application/json" },
            "url": "http://localhost:3000/v1/auth/login",
			"body": JSON.stringify(req.body)
		}, (error, response, body) => {
			if(error) {
                res
                .status(500)
                .json({ code    : 0,
                        type    : "server",
                        message : ("access to auth service broken : " + error)})
            }
            else {
                res
                .status(response.statusCode)
                .send(response.body)
            }
        });
	}
	else if (req.url.includes("/v1/auth/verifyaccess")){
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
            return
        }
		request.get({
            "headers": { "content-type" : "application/json",
                         "authorization": `bearer ${token}`},
			"url": "http://localhost:3000/v1/auth/verifyaccess"
		}, (error, response) => {
			if(error) {
                res
                .status(500)
                .json({ code    : 0,
                        type    : "server",
                        message : ("access to auth service broken : " + error)})
            }
            else {
                res
                .status(response.statusCode)
                .send(response.body)
            }
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
            return
        }
        if (token){
            request.get({
                "headers": { "content-type" : "application/json",
                             "authorization": `bearer ${token}` },
                "url": "http://localhost:3000/v1/auth/verifyaccess"
            }, (error, response) => {
                if(error) {
                    res
                    .status(500)
                    .json({ code    : 0,
                            type    : "server",
                            message : ("access to auth service broken : " + error)})
                }
                else if(response.statusCode !== 200) {
                    res
                    .status(response.statusCode)
                    .send(response.body) 
                }
                else{
                    next()
                }
            });
        }
    }
})

// On injecte le modèle dans le routeur
app.use('/v1/alerts', alertsRouter(alertsModel))

// For unit tests
exports.app = app