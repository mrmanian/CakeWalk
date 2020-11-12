import React, { useState } from 'react';
import Dash from './Dash';
import Login from './Login';
import { Socket } from './Socket';

export default function Content() {
  const [login, setLogin] = React.useState(false);
  const [email, setEmail] = React.useState('');

  function updateLogin(data) {
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log(`Received login status from server: ${data.loginStatus}`);
    setLogin(data.loginStatus);
    setEmail(data.email);
  }
  function getLogin() {
    React.useEffect(() => {
      Socket.on('login_status', updateLogin);
      return () => {
        Socket.off('login_status', updateLogin);
      };
    });
  }
  getLogin();

  if (login) {
    return (<Dash email={email} />);
  }

  return (<Login />);
}
