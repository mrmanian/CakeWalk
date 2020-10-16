import React, { useState } from "react";
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
const imgs = {
      width: '10%',
      height: '10%',
      borderRadius: '8px',
};

export default function Chat({user, img}) {
  const [list, setList] = useState([]);
  const [userCount, setUserCount] = useState(1);
  
  function getNewMessageList() {
        React.useEffect(() => {
            Socket.on('newmessagetolist', (data) => {
                 console.log("Received new message list from server" + data['mlist']);
                 
                 setList(data['mlist']);
            
        });
        });
       
    }
    function Condition(props) {
        console.log(props.mark);
        if(props.mark === 'i'){
            return <img style= {imgs} src= {props.text} alt="pic" />;
        }
        else if(props.mark === 'u'){
            return <a href={props.text}> {props.text}</a>;
        }
   
        return null;
    
    }
    useEffect(() => {
        Socket.on('connected', (data) => {
            console.log("Got number of users : " + data['test']);
            setUserCount(data['test']);
        });
    });
    
    useEffect(() => {
        Socket.on('disconnected', (data) => {
            setUserCount(data['num']);
        });
     });
     
     
    getNewMessageList();
    
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
            <ChatButton user = {user} img = {img} />
        </div>
            <h2 align="right">Conncection Count: {userCount} </h2>
            <div style = {chats} >
                <ScrollToBottom>
                    <ol style={{width: '100%'}}>
                    {
                        list.map((text, index) => <li style={{width: '100%', color: text[1] === 'Spock_bot'? 'green' : 'blue'}} key={index}>
                        <img style = {imgs} src={text[2]}/>
                        {text[3] ? <Condition mark={text[3]} text={text[0]} /> : <span>{text[1]}: {text[0]}</span> }</li> 
                        )
                    }
                    </ol>
                </ScrollToBottom>
            </div>
            
        </div>
    );
}
