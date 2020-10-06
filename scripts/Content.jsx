import React, { useState } from "react";
import Login from './Login';
import {Chat} from './Chat';
import {Socket} from './Socket';

export default function Content() {
  const [user, setUser] = useState('');
  
  function newUser() {
    React.useEffect(() => {
      Socket.on('new user', (data) => {
        console.log("Recieved info of new user "+ data['user']);
        setUser(data['user']);
      })
    });
  }
  
  newUser();
  return (
    <div>
    <Login />
    <span> Welcome {user}</span>
    </div>
  );
}