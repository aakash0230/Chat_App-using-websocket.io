let socket = io();

var html = ""
function scrollToBottom(){
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

// connected to server
socket.on("connect", function () {
    console.log("connected to the server");
    let params = window.location.search.substring(1);
    params = JSON.parse('{"'+ decodeURI(params).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}')

    socket.emit('join', params, function(err) {
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log("There is no error");

        }
    })
});

// disconnecting to server
socket.on("disconnect", function () {
console.log("disconnected to the server");
});

socket.on('updateUserList', function(users){
    console.log(users);
    var userHtml =`<ol>`;
    users.forEach(function(user){
        userHtml += `<li>${user}</li>`
    })
    userHtml+="</ol>"
    document.getElementById('users').innerHTML = userHtml;

})



// getting the event from server
socket.on("newMessage", function (message) {
    
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newMessage", message);
    html += `<li class="message">
                <div class="message__title">
                    <h4>${message.from}</h4>
                    <span>${formattedTime}</span>
                </div>
                <div class="message__body">
                    <p>${message.text}</p>
                </div>
             </li>`
    document.getElementById('messages').innerHTML = html;
    scrollToBottom();
});


socket.on("newLocationMessage", function (message) {
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newLocationMessage", message);
    console.log("message 1");
    html += `<li class="message">
                <div class="message__title">
                    <h4>${message.from}</h4>
                    <span>${formattedTime}</span>
                </div>
                <div class="message__body">
                    <a href = "${message.url}">My current location</a>
                </div>
            </li>`
    document.getElementById('messages').innerHTML = html;
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