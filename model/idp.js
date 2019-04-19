const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const usersModel = require('./users')

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

const getJWT = (user) => {
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

const checkJWT = (token) => {
    let result = false
    try {
        if (jwt.verify(token, publicKEY, verifyOptions))
            result = true
    } catch (error) { 
    }
    return result
}

const getExpirity = () => {
    return expirity
}

exports.getJWT = getJWT
exports.getExpirity = getExpirity
exports.checkJWT = checkJWT