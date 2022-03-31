let socket = io();

function scrollToBottom(){
    let messages = document.querySelector('#aakash').lastElementChild;
    messages.scrollIntoView();
}

// connected to server
socket.on("connect", function () {
    console.log("connected to the server");

});

// disconnecting to server
socket.on("disconnect", function () {
console.log("disconnected to the server");
});

var html = ""

// getting the event from server
socket.on("newMessage", function (message) {
    
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newMessage", message);
    console.log("message 1");
    // let li = document.createElement('li');
    // li.innerText = `${message.from} ${formattedTime} : ${message.text}`
    // document.querySelector('body').appendChild(li);
    
    html += `<li>
                    ${message.from} ${formattedTime} : ${message.text}
                </li>`
    document.getElementById('aakash').innerHTML = html;
    scrollToBottom();
});


socket.on("newLocationMessage", function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newLocationMessage", message);
    console.log("message 1");
    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.innerText = `${message.from} ${formattedTime} : `
    // a.setAttribute('target', '_blank')
    // a.setAttribute('href', message.url)
    // a.innerText = 'My current location'
    // li.appendChild(a)

    html += `<li>
                ${message.from} ${formattedTime} : <a href = "${message.url}">My current Location</a>
            </li>`

    // document.querySelector('body').appendChild(li);
    document.getElementById('aakash').innerHTML = html;
    scrollToBottom();
});


document.querySelector('#submit-btn').addEventListener('click', function(e){
    e.preventDefault(); 

    socket.emit("createMessage", {
        from : "User",
        text : document.querySelector('input[name="message"]').value
    }, function(){

    })
});

document.querySelector('#send-location').addEventListener('click', function(e) {
    if(!navigator.geolocation)
        return alert("Geolocation is not supported by your browser.");
    navigator.geolocation.getCurrentPosition(function(position){
        // console.log(position);
        socket.emit('createLocationMessage', {
            lat : position.coords.latitude,
            lng : position.coords.longitude
        });
    }, function(){
        alert("unable to fetch your location");
    })
})