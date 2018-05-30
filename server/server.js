const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


//checking the port
const port = process.env.PORT || 3000;



const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)

// MIDDLEWARES
app.use(express.static(publicPath));

// io
io.on('connection', (socket)=>{
    console.log('new User connected');
    socket.on('disconnect',()=>{
        console.log('User disconnected from server');
    });
});





server.listen(port, ()=>{
    console.log(`application is running on port ${port}`);
})