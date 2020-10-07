import * as React from 'react';
import { Socket } from './Socket';

function handleSubmit(event) {
    let newMessage = document.getElementById("message_input");
    Socket.emit('newmessage', {
        'text': newMessage.value,
    })
    
    console.log('Sent the message ' + newMessage.value + ' to server!');
    newMessage.value = ''
    
    event.preventDefault();
}

export function ChatButton() {
    return (
        <form onSubmit={handleSubmit}>
            <input id="message_input" placeholder="Enter your Cosmos Chat Here!"></input>
            <button>Enter</button>
        </form>
    );
}
