const express = require("express");
const http = require("http");
const path = require("path");
const ejs = require("ejs");
const socketIo = require("socket.io");
const {generateMessage, generateLocationMessage} = require("./utils/message");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"/../public");
const templatePath = path.join(__dirname,"/../public");

let app = express()
let server = http.createServer(app);
let io = socketIo(server);

app.set('view engine','ejs')
app.set('views',templatePath)
app.use(express.static(publicPath));

app.get("/pass", (req, res) => {
    res.render("pass");
})

// connnecting the client and server
io.on("connection", (socket) => {
    console.log("A new user just connected");

    socket.emit('newMessage', generateMessage('Admin', 'welcome to The chat app !'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user Joined'));


    // getting the event from client
    socket.on('createMessage', (message, callback) => {
        console.log("message 3");
        console.log("createMessage", message);
        console.log("message 4");
        
        // below code sends the message to everyone
        io.emit('newMessage', generateMessage(message.from, message.text));

        callback('you did it successfully');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng)); 
    });
    
    // disconnected from the server
    socket.on("disconnect", () => {
        console.log("A new user just disconnected");
    });
});


server.listen(port, () => {
    console.log("logging in server");
})