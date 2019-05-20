const config = require('config')

const {app} = require('./app')

const {portAuth} = config.get('authConfig')

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(portAuth)