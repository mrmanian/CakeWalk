import * as React from 'react';
import { Socket } from './Socket';
import Chat from './Chat';


export function ChatButton({user}) {
    
    function handleSubmit(event) {
    const u = 'jake';
    let newMessage = document.getElementById("message_input");
    console.log(user);
    Socket.emit('newmessage', {
        'text': newMessage.value, 'username': user
    });
    
    console.log('Sent the message ' + newMessage.value+ ' to server!');
    newMessage.value = '';
    
    event.preventDefault();
}


    
    return (
        <form onSubmit={handleSubmit}>
            <input id="message_input" placeholder="Enter your Cosmos Chat Here!"></input>
            <button>Enter</button>
        </form>
    );
}
