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
    
    // disconnected from the server
    socket.on("disconnect", () => {
        console.log("A new user just disconnected");
    });
});


server.listen(port, () => {
    console.log("logging in server");
})