const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/isReal");
const {Users} = require("./utils/users");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"/../public");

let app = express()
let server = http.createServer(app);
let io = socketIo(server);

let users = new Users();
app.use(express.static(publicPath));



// connnecting the client and server
io.on("connection", (socket) => {
    console.log("A new user just connected");


    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback("Name and room are required");
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', `welcome to the ${params.room} room !`));

        // socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user Joined'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New user joined"))

        callback();
    })

    // getting the event from client
    socket.on('createMessage', (message, callback) => {
        console.log("message 3");
        console.log("createMessage", message);
        console.log("message 4");

        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('you did it successfully');
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage( `${user.name}`, coords.lat, coords.lng)); 
        }
    });
    
    // disconnected from the server
    socket.on("disconnect", () => {
        console.log("A new user just disconnected");
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} chat room`))
        }
    });
});


server.listen(port, () => {
    console.log("logging in server");
})