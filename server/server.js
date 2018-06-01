const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');


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

    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'))

    socket.on('createMessage', (message, callback)=>{
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude , coords.longitude ))
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected from server');
    });
});





server.listen(port, ()=>{
    console.log(`application is running on port ${port}`);
})