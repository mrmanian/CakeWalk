import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';
import { ChatButton } from './ChatButton';

export default function Chat({user}) {
  const [list, setList] = useState([]);
  //const [user, setUser] = useState('');
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
            <ChatButton user = {user} />
                <ol>
                    {
                    list.map((text, index) => <li key={index}>{text}</li>)
                    }
                </ol>
            
        </div>
    );
}
