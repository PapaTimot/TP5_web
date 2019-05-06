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

/* GET alerts filtered by their status
curl http://localhost:3000/v1/alerts/search?status=danger,risk */
router.get('/search', async function (req, res, next) {
  let statusFilter = undefined
  try {
    statusFilter = req.query.status.split(",")
  } catch (error) {
    res
    .status(400)
    .json({message: 'Wrong parameter'})
    return
  }

  /* istanbul ignore else */
  if (statusFilter) {
    try {
      const alertsFound = await alertsModel.getFiltered(statusFilter)
      res.json(alertsFound)
    } catch (error) {
      res
      .status(400)
      .json({message: 'Internal error'})
    }
  }
  else {
  res
    .status(400)
    .json({message: 'Wrong parameter'})
  }
})

/* GET a specific alert by id
curl http://localhost:3000/v1/alerts/5cd03052bfee6a258c439d60 */
router.get('/:id', async function (req, res, next) {
  const id = req.params.id

  /* istanbul ignore else */
  if (id) {
    try {
      const alertFound = await alertsModel.get(id)
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
curl -X POST -H "Content-Type: application/json"  http://localhost:3000/v1/alerts -d '{"type":"transport","label":"My alert for","status":"risk","from":"string","to":"string"}'*/
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

/* Update a specific alert 
curl -X PATCH -H "Content-Type: application/json"  http://localhost:3000/v1/alerts/5cd03052bfee6a258c439d60 -d '{"status":"danger"}'*/
router.patch('/:id', async function (req, res, next) {
  const id = req.params.id
  const newAlertProperties = req.body

  /* istanbul ignore else */
  if (id && newAlertProperties) {
    try {
      const updated = await alertsModel.update(id, newAlertProperties)
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

/* REMOVE a specific alert by id 
curl -X DELETE http://localhost:3000/v1/alerts/5cd03052bfee6a258c439d60 */
router.delete('/:id', async function (req, res, next) {
  const id = req.params.id

  /* istanbul ignore else */
  if (id) {
    try {
      await alertsModel.remove(id)
      res.status(200)
    } catch (error) {
      res
      .status(404)
      .json({message: `Alert not found with id ${id}`})
    }
  }
  else {
  res
    .status(400)
    .json({message: 'Invalid ID supplied'})
  }
})

/** return a closure to initialize model */
module.exports = (model) => {
  alertsModel = model
  return router
}
