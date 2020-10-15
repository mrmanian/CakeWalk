import * as React from 'react';
import { Socket } from './Socket';
import Chat from './Chat';


export function ChatButton({user, img}) {
    
    function handleSubmit(event) {
    
    let newMessage = document.getElementById("message_input");
    console.log(user);
    console.log(img);
    Socket.emit('newmessage', {
        'text': newMessage.value, 'username': user, 'imageurl': img,
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
