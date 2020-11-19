import React, { useState, useEffect } from 'react';
import Dash from './Dash';
import LoginPage from './LoginPage';
import { Socket } from './Socket';

export default function Content() {
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState('');

  function updateLogin(data) {
    console.log(`Received login status from server: ${data.loginStatus}`);
    setLogin(data.loginStatus);
    setEmail(data.email);
  }
  function getLogin() {
    useEffect(() => {
      Socket.on('login_status', updateLogin);
      return () => {
        Socket.off('login_status', updateLogin);
      };
    });
  }
  getLogin();

  if (login && email !== '') {
    return (<Dash email={email} />);
  }

  return (<LoginPage />);
}
