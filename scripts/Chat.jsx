import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';
import { ChatButton } from './ChatButton';
import { Style } from "radium";

export default function Chat({user}) {
  const [list, setList] = useState([]);
  var connectCount = 0;
  
  function getNewMessageList() {
        React.useEffect(() => {
            Socket.on('newmessagetolist', (data) => {
                 console.log("Received new message list from server" + data['mlist']);
                 
                 setList(data['mlist']);
            
        })
        });
       
    }
    
    Socket.on('connect', (data) => {
       connectCount = data['test']
    });
    Socket.on('disconnect', (data) => {
       connectCount = data['num']
    });
    getNewMessageList();
    console.log(typeof list);
     return (
        <div style = {{textAlign: "center"}} >
         <Style
            scopeSelector="li"
            rules={{
                color: "blue",
                fontSize: 40,
                textAlign: "center",
                paddingTop: "100px",
            }}
        />
            <ChatButton user = {user} />
                <ol style={{width: "500px"}}>
                    {
                    list.map((text, index) => <li style={{width: 200}} key={index}>{text[1]}: {text[0]}</li>)
                    }
                </ol>
            <h2 align="right">Conncection Count: {connectCount} </h2>
        </div>
    );
}
