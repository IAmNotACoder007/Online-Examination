const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// our localhost port
const port = 8080;

const app = express();

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });

    socket.on('doLogin', (data) => {
        console.log(`Got a login request from user with data ${data.userId} and ${data.password}`);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`))