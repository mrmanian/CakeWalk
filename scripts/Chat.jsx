import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';
import { ChatButton } from './ChatButton';

export default function Chat({user}) {
  const [list, setList] = useState([]);
  
  function getNewMessageList() {
        React.useEffect(() => {
            Socket.on('newmessagetolist', (data) => {
                 console.log("Received new message list from server" + data['mlist']);
                 
                 setList(data['mlist']);
            
        })
        });
       
    }
    getNewMessageList();
    console.log(typeof list);
     return (
        <div>
            <ChatButton />
                <ol>
                    {
                    list.map((text, index) => <li key={index}>{user} : {text}</li>)
                    }
                </ol>
            
        </div>
    );
}
