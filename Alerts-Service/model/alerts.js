const uuidv1 = require('uuid/v1')
const tcomb = require('tcomb')

const bcrypt = require('bcrypt');
const saltRounds = 10;

const alert = tcomb.struct({
    id: tcomb.String,
    name: tcomb.String,
    login: tcomb.String,
    age: tcomb.Number,
    password: tcomb.String
}, {strict: true})

const alerts = [
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
    const alertsFound = alerts.filter((alert) => alert.id === id)
    if (alertsFound.length >= 1){
        result = Object.assign({}, alertsFound[0])
        delete result.password
    }
    else {
        result = undefined
    }
    return result
}

const ggetFiltered = () => {
    const result = []
    let tmp = null
    alerts.forEach(alert => {
        tmp = Object.assign({}, alert)
        delete tmp.password
        result.push(tmp)
    });
    return result
}

const add = (alert) => { 
    return new Promise((resolve, reject) => {
        bcrypt.hash(alert.password, saltRounds)
        .then((hash) => {
            alert.password = hash
            const newalert = {
                ...alert,
                id: uuidv1()
            }
            if (validatealert(newalert)) {
                alerts.push(newalert)
                resolve(newalert)
            } else {
                reject('alert.not.valid')
            }
        })
        .catch((error) => {
            reject(error)
        })
    })
}

const update = (id, newalertProperties) => {
    const alertsFound = alerts.filter((alert) => alert.id === id)

    if (alertsFound.length === 1) {
        const oldalert = alertsFound[0]

        const newalert = {
            ...oldalert,
            ...newalertProperties
        }

        // Control data to patch
        if (validatealert(newalert)) {
            // Object.assign permet d'éviter la suppression de l'ancien élément puis l'ajout
            // du nouveau, il assigne à l'ancien objet toutes les propriétés du nouveau
            Object.assign(oldalert, newalert)
            return oldalert
        } else {
            throw new Error('alert.not.valid')
        }
    } else {
        throw new Error('alert.not.found')
    }
}

const remove = (id) => {
    const indexFound = alerts.findIndex((alert) => alert.id === id)
    if (indexFound > -1) {
        alerts.splice(indexFound, 1)
    } else {
        throw new Error('alert.not.found')
    }
}

exports.get = get
exports.getFiltered = getFiltered
exports.add = add
exports.update = update
exports.remove = remove