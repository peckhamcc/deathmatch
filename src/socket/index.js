if (process.env.NODE_ENV === 'production') {
  const io = require('socket.io-client')
  const socket = io('//')

  module.exports = socket
} else {
  module.exports = require('./demo')
}
