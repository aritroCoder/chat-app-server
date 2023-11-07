import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
    maxHttpBufferSize: 3 * 1e7 // 30 MB
})

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

io.on('connection', (socket) => {
    socket.on('new-user', (user) => {
        console.log('user joined: ', user)
        console.log('user id: ', socket.id)
        socket.emit('user', socket.id)
    })
    socket.on('new-message', (message) => {
        socket.broadcast.emit('message', message)
    })
    // video call
    socket.on('call-user', (data) => {
        socket.to(data.to).emit('call-made', {
            offer: data.offer,
            socket: socket.id
        })
    })
})

server.listen(5500, () => {
    console.log('server running at http://localhost:5500')
})
