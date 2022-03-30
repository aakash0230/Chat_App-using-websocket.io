let socket = io();


// connected to server
socket.on("connect", function () {
    console.log("connected to the server");

    // sending this event to server
    // socket.emit('createMessage', {
    //     form: " client side",
    //     to : "server side"
    // });

});

// disconnecting to server
socket.on("disconnect", function () {
console.log("disconnected to the server");
});

// getting the event from server
socket.on("newMessage", function (message) {
    console.log("newMessage", message);
});