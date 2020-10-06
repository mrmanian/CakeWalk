import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Socket } from './Socket';
import {Redirect} from 'react-router-dom';

export default function Login() {
  const [uname, setUName] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return uname.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    console.log("submitted");
    Socket.emit('newlogin', {'uname': uname , 'password': password});
    event.preventDefault();
    return <Redirect to="/chat/"/>;
    
    
  }

  return (
    <div className="Login" style={{ height: '100vh'}}>
    <h1> Welcome to Cosmos Chat!</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={uname}
            onChange={e => setUName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Register New User
        </Button>
      </form>
    </div>
  );
}
