/*This file will contain functions regarding the user validation */
const joinButton = document.getElementById('join-button');
const entryBox = document.querySelector('.entry-box');
const userName = document.querySelector('#userName');
const roomName = document.querySelector('#roomName');

console.log("userFile connected");

function validation(data) {
    if (data.name.trim().length < 4) {
        return false;
    }
    if (data.roomName.trim().length === 0) {
        return false;
    }
    return true;
}

function joinRoom() {
    let data = {
        name: userName.value,
        roomName: roomName.value
    }
    console.log(data);
    const isValid = validation(data);
    if (isValid) {
        const url = '/c' + '?name=' + userName.value + '&room=' + roomName.value;
        window.location.href = url;
    }
    else {
        var p = document.createElement('p');
        p.setAttribute('class', 'error');
        var error = document.createTextNode('Enter a valid username and room name !');
        p.setAttribute('value', error);
        console.log(p);
        entryBox.append(error);
    }
}