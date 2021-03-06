const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {Users} = require('./utils/user')
const {isRealString} = require('./utils/validation')
const {generateMessage, generateLocationMessage} = require('./utils/message');


//checking the port
const port = process.env.PORT || 3000;



const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
var users = new Users();

// MIDDLEWARES
app.use(express.static(publicPath));

// io
io.on('connection', (socket)=>{
    console.log('new User connected');



    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('name and room are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    })

    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage( user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, coords.latitude , coords.longitude ))
    })

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        console.log(user);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});





server.listen(port, ()=>{
    console.log(`application is running on port ${port}`);
})