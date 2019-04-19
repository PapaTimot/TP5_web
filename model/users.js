const uuidv1 = require('uuid/v1')
const tcomb = require('tcomb')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const USER = tcomb.struct({
    id: tcomb.String,
    name: tcomb.String,
    login: tcomb.String,
    age: tcomb.Number,
    password: tcomb.String
}, {strict: true})

const users = [
    {
        id: '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e',
        name: 'Pedro Ramirez',
        login: 'pedro',
        age: 44,
        password: bcrypt.hashSync('tequila', saltRounds)
    }, {
        id: '456897d-98a8-78d8-4565-2d42b21b1a3e',
        name: 'Jesse Jones',
        login: 'jesse',
        age: 48,
        password: bcrypt.hashSync('mojito', saltRounds)
    }, {
        id: '987sd88a-45q6-78d8-4565-2d42b21b1a3e',
        name: 'Rose Doolan',
        login: 'rose',
        age: 36,
        password: bcrypt.hashSync('diabolo', saltRounds)
    }, {
        id: '654de540-877a-65e5-4565-2d42b21b1a3e',
        name: 'Sid Ketchum',
        login: 'sid',
        age: 56,
        password: bcrypt.hashSync('limonccelo', saltRounds)
    }
]

const get = (id) => {
    let result = null
    const usersFound = users.filter((user) => user.id === id)
    if (usersFound.length >= 1){
        result = Object.assign({}, usersFound[0])
        delete result.password
    }
    else {
        result = undefined
    }
    return result
}

const getAll = () => {
    const result = []
    let tmp = null
    users.forEach(user => {
        tmp = Object.assign({}, user)
        delete tmp.password
        result.push(tmp)
    });
    return result
}

const add = (user) => { 
    user.password = bcrypt.hashSync(user.password, saltRounds)
    const newUser = {
        ...user,
        id: uuidv1()
    }
    if (validateUser(newUser)) {
        users.push(newUser)
    } else {
        throw new Error('user.not.valid')
    }
    return newUser
}

const update = (id, newUserProperties) => {
    const usersFound = users.filter((user) => user.id === id)

    if (usersFound.length === 1) {
        const oldUser = usersFound[0]

        const newUser = {
            ...oldUser,
            ...newUserProperties
        }

        // Control data to patch
        if (validateUser(newUser)) {
            // Object.assign permet d'éviter la suppression de l'ancien élément puis l'ajout
            // du nouveau, il assigne à l'ancien objet toutes les propriétés du nouveau
            Object.assign(oldUser, newUser)
            return oldUser
        } else {
            throw new Error('user.not.valid')
        }
    } else {
        throw new Error('user.not.found')
    }
}

const remove = (id) => {
    const indexFound = users.findIndex((user) => user.id === id)
    if (indexFound > -1) {
        users.splice(indexFound, 1)
    } else {
        throw new Error('user.not.found')
    }
}

const verifyUser = (login, password) => {
    const usersFound = users.filter((user) => user.login === login)
    let result = false

    if (usersFound.length >= 1 && bcrypt.compareSync(password, usersFound[0].password)){
        result = true
    }

    // await bcrypt.compare(password, user.passwordHash);
    // bcrypt.compare(password, user.password).then(function(res) {
    //     if (res){
    //         result = true
    //     }
    // });

    return result
}

function validateUser(user) {
    let result = false
    /* istanbul ignore else */
    if (user) {
        try {
            const tcombUser = USER(user)
            result = true
        } catch (exc) {
            result = false
        }
    }
    return result
}

exports.get = get
exports.getAll = getAll
exports.add = add
exports.update = update
exports.remove = remove
exports.verifyUser = verifyUser