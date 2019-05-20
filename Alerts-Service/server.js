const {app} = require('./app')

const port = process.env.PORT || '4000'

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port)