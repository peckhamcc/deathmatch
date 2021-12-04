import demo from './demo/index.js'
import live from './socket.js'

export default process.env.NODE_ENV === 'production' ? demo() : live()
