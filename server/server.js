const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"/../public");
let app = express()
let server = http.createServer(app);
let io = socketIo(server);

app.use(express.static(publicPath));

// connnecting the client and server
io.on("connection", (socket) => {
    console.log("A new user just connected");

    socket.emit('newMessage', {
        from : "Admin",
        text : "Welcome to the chat app",
        createdAt : new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from : "Admin",
        text : "A new user joined",
        createdAt : new Date().getTime()
    });



    // sending the event to client
    // socket.emit("newMessage", {
    //     from : "server side", 
    //     to : "client side"
    // })

    // getting the event from client
    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        
        // below code sends the message to everyone
        // io.emit('broadCastMessage', {
        //     from : message.from, 
        //     to : message.to,
        //     createdAt : new Date().getTime()
        // });

        // below code sends the message to everyone except one who created
        socket.broadcast.emit('newMessage',{
            from : message.from, 
            to : message.to,
            createdAt : new Date().getTime()
        });
    });
    
    // disconnected from the server
    socket.on("disconnect", () => {
        console.log("A new user just disconnected");
    });
});


server.listen(port, () => {
    console.log("logging in server");
})