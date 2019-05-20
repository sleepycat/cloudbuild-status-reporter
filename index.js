const { Server } = require('./src/Server.js')
const PORT = process.env.PORT || 8080

const server = Server({ log: console.log })
server.listen(PORT, () => console.log(`🚀 listening on port ${PORT}`))
