import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
    maxHttpBufferSize: 3*1e7 // 30 MB
});

app.get('/', (req, res) => {
    res.send("<h1>Hello world</h1>");
});

io.on('connection', (socket) => {
    socket.on('new-user', (user) => {
        socket.broadcast.emit('user', user)
    });
    socket.on('new-message', (message) => {
        socket.broadcast.emit('message', message)
    })
});

server.listen(5500, () => {
    console.log('server running at http://localhost:5500');
});