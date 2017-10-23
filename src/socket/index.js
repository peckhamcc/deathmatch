
if (process.env.NODE_ENV === 'DEMO') {
  module.exports = require('./demo')
} else {
  const io = require('socket.io-client')
  const socket = io('//')

  module.exports = socket
}
