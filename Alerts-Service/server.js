const config = require('config')

const {app} = require('./app')

const {portAlerts} = config.get('alertsConfig')

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(portAlerts)