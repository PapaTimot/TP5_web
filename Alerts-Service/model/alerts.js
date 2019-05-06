const uuidv1 = require('uuid/v1')
const tcomb = require('tcomb')

const mongoose = require('mongoose')

// const Category = [
//     'weather',
//     'sea',
//     'transport'
// ]

// const Status = [
//     'warning',
//     'threat',
//     'danger',
//     'risk'
// ]

// const ALERT = tcomb.struct({
//     id     : tcomb.String,
//     type   : tcomb.String,
//     label  : tcomb.String,
//     status : tcomb.String,
//     from   : tcomb.String,
//     to     : tcomb.string
// }, {strict: true})

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
})

const AlertModel = mongoose.model('Alert', alertSchema)

/*const alerts = [
    {
        id: '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e',
        type: Category.transport,
        label: 'My alert for',
        status: Status.risk,
        from: 'string',
        to: 'string'
    }
]*/

const get = async (id) => {
    let alertFound = undefined
    try {
        alertFound = await AlertModel.findById(id)
    } catch (exc) {
        console.log(exc)
    }
    return alertFound
}

const getFiltered = async (statusSearched) => {    
    let alertsFound = []
    try {
        alertsFound = await AlertModel.find({status: {$in: statusSearched}})
    } catch(exc) {
        console.log(exc)
    }
    return alertsFound
}

const add = async (alert) => {
    alert = {
        ...alert,
        id: uuidv1()
    } 
    const newAlert = new AlertModel({
        ...alert
    })
    if (validateAlert(alert)) {
        try {
            await newAlert.save()
        } catch(exc) {
            throw new Error(exc)
        }
    } else {
        throw new Error('alert.not.valid');
        
    }
}

const update = async (id, newAlertProperties) => {
    let alertFound = undefined
    try {
        alertFound = await AlertModel.findByIdAndUpdate(id, newAlertProperties,{new: true})
    } catch (exc) {
        throw new Error('alert.not.found')
    }
    if (validateAlert(alertFound)) {
        return alertFound
    } else {
        throw new Error('alert.not.valid')
    }
}

const remove = async (id) => {
    try {
        await AlertModel.findByIdAndRemove(id)
    } catch(exc) {
        throw new Error(`Can't remove alert with id=${id}`)
    }
}

const validateAlert = (alert) => {
    // let result = false
    // if (alert) {
    //     try {
    //         const tcombAlert = ALERT(alert)
    //         result = true
    //     } catch (exc) {
    //         result = false
    //     }
    // }
    // return result
    return true
}

exports.get = get
exports.getFiltered = getFiltered
exports.add = add
exports.update = update
exports.remove = remove