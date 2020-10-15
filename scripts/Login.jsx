import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Socket } from './Socket';
import {Redirect} from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';


export default function Login() {

  function handleSubmit(response) {
    console.log("submitted");
    console.log(response.profileObj.name);
    console.log(response.profileObj.imageUrl);
    Socket.emit('newlogin', {'uname': response.profileObj.name , 'imageurl': response.profileObj.imageUrl});
    event.preventDefault();
    return <Redirect to="/chat/"/>;
    
    
  }
   function handleFail(){
        console.log("Fail");
    }

  return (
    <div>
    <h1> Please sign on with Google. </h1>
    
    <div>
        <GoogleLogin
            clientId="820684354318-tlcrjakf8qm4o0ln9e9r0qqoh0kq2tc6.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={handleSubmit}
            onFailure={handleFail}
            cookiePolicy={'single_host_origin'}
        />
   
    </div>
    </div>
  );
}
