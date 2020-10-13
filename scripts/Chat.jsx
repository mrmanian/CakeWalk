import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';
import { ChatButton } from './ChatButton';
import { Style } from "radium";
import ScrollToBottom from 'react-scroll-to-bottom';
import { useEffect } from 'react';


const chats = {
    width: '100%',
    height: '800px',
    textAlign: 'right',
    padding: '5px',
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: 'row-reverse'
};

export default function Chat({user}) {
  const [list, setList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  
  function getNewMessageList() {
        React.useEffect(() => {
            Socket.on('newmessagetolist', (data) => {
                 console.log("Received new message list from server" + data['mlist']);
                 
                 setList(data['mlist']);
            
        })
        });
       
    }
    useEffect(() => {
        Socket.on('connect', (data) => {
            console.log(data['test']);
            setUserCount(data['test']);
        });
    });
    
    useEffect(() => {
        Socket.on('disconnected', (data) => {
            setUserCount(data['num']);
        });
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
        <div>
            <ChatButton user = {user} />
        </div>
            <h2 align="right">Conncection Count: {userCount} </h2>
            <div style = {chats} >
                <ScrollToBottom>
                    <ol style={{width: '100%'}}>
                    {
                        list.map((text, index) => <li style={{width: '100%', color: text[1] === 'Spock_bot'? 'green' : 'blue'}} key={index}>{text[1]}: {text[0]}</li>)
                    }
                    </ol>
                </ScrollToBottom>
            </div>
            
        </div>
    );
}
