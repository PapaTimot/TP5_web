const fs   = require('fs');
const jwt  = require('jsonwebtoken');

let usersModel = undefined
const idpModel = {}

const privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');

const expirity = "1h"
const signOptions = {
    expiresIn : expirity,
    algorithm : "RS256"
};

const verifyOptions = {
    expiresIn:  expirity,
    algorithm:  ["RS256"]
};

idpModel.getJWT = (user) => {
    let result
    if (usersModel.verifyUser(user.login, user.password)){
        const payload = {name : user.name, login : user.login};
        result = jwt.sign(payload, privateKEY, signOptions);
    }
    else {
        result = false
    }
    return result
}

idpModel.checkJWT = (token) => {
    let result = true
    try {
        jwt.verify(token, publicKEY, verifyOptions)
    } catch (error) {
        result = false
    }
    return result
}

idpModel.getExpirity = () => {
    return expirity
}

/** return a closure to initialize model */
module.exports = (model) => {
    usersModel = model
    return idpModel
}