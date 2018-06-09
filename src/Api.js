import openSocket from 'socket.io-client';

const socket = openSocket("http://localhost:8080");

function subscribeToEvent(name, callback) {
    socket.on(name, callback);
}

function emitEvent(name, data) {
    socket.emit(name, data);
}

export {
    subscribeToEvent,
    emitEvent,
}