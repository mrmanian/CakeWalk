import React, { useState } from "react";
import Login from './Login';
import  Chat  from './Chat';
import {Socket} from './Socket';

export default function Content() {
  const [user, setUser] = useState('');
  const [img, setImg] = useState('');
  
  function newUser() {
    React.useEffect(() => {
      Socket.on('new user', (data) => {
        console.log("Recieved info of new user "+ data['user']);
        setUser(data['user']);
        setImg(data['imageurl'])
      })
    });
  }
  
  newUser();
  return (
    user ? <Chat user = {user} img = {img} /> : <Login />
  
  );
}