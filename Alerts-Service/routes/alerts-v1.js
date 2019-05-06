const express = require('express')
const router = express.Router()

let alertsModel = undefined

/* Control alertModel initialisation */
router.use((req, res, next) => {
  /* istanbul ignore if */
  if (!alertsModel) {
    res
      .status(500)
      .json({message: 'model not initialised'})
  }
  next()
})

/* GET a specific alert by id
curl http://localhost:3000/v1/alerts/5cd03052bfee6a258c439d60 */
router.get('/:id', async function (req, res, next) {
  const id = req.params.id

  /* istanbul ignore else */
  if (id) {
    try {
      const alertFound = await alertsModel.get(id)
      console.log(alertFound + "\n" + id);
      res.json(alertFound)
    } catch (error) {
      res
      .status(404)
      .json({message: `Alert not found with id ${id}`})
    }
  }
  else {
  res
    .status(400)
    .json({message: 'Wrong parameter'})
  }
})

/* Add a new alert 
curl -X POST -H "Content-Type: application/json"  http://localhost:3000/v1/alerts -d '{type:"transport",label:"My alert for",status:"risk",from:"string",to:"string"}'*/
router.post('/', async function (req, res, next) {
  const newAlert = req.body

  /* istanbul ignore else */
  if (newAlert) {
    try {
      const alert = await alertsModel.add(newAlert)
      res
      .status(201)
      .send(alert)
    } catch (error) {
      res
      .status(400)
      .json({message: error.message})
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameters'})
  }
})

/* Update a specific alert */
router.patch('/:id', function (req, res, next) {
  const id = req.params.id
  const newalertProperties = req.body

  /* istanbul ignore else */
  if (id && newalertProperties) {
    try {
      const updated = alertsModel.update(id, newalertProperties)
      res
        .status(200)
        .json(updated)

    } catch (exc) {

      if (exc.message === 'alert.not.found') {
        res
          .status(404)
          .json({message: `alert not found with id ${id}`})
      } else {
        res
          .status(400)
          .json({message: 'Invalid alert data'})
      }
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameters'})
  }
})

/* REMOVE a specific alert by id */
router.delete('/:id', function (req, res, next) {
  const id = req.params.id

  /* istanbul ignore else */
  if (id) {
    try {
      alertsModel.remove(id)
      req
        .res
        .status(200)
        .end()
    } catch (exc) {
      /* istanbul ignore else */
      if (exc.message === 'alert.not.found') {
        res
          .status(404)
          .json({message: `alert not found with id ${id}`})
      } else {
        res
          .status(400)
          .json({message: exc.message})
      }
    }
  } else {
    res
      .status(400)
      .json({message: 'Wrong parameter'})
  }
})

/* GET all alerts */
router.get('/', function (req, res, next) {
  res.json(alertsModel.getAll())
})

/** return a closure to initialize model */
module.exports = (model) => {
  alertsModel = model
  return router
}
