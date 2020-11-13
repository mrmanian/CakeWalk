/* eslint import/no-extraneous-dependencies: */
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { Socket } from './Socket';
/* eslint no-console: ["error", { allow: ["log"] }] */
export default function Login() {
  const header = {
    textAlign: 'center',
    color: '#561B1F',
  };
  const desc = {
    textAlign: 'center',
    color: '#193B53',
  };
  const button = {
    textAlign: 'center',
    color: '#BEB07B',
  };

  function handleSubmit(response) {
    console.log('submitted');
    console.log(response.profileObj.name);
    console.log(response.profileObj.imageUrl);
    console.log(response.profileObj.email);
    Socket.emit('newlogin', { uname: response.profileObj.name, imageurl: response.profileObj.imageUrl, email: response.profileObj.email });
    Socket.emit('user email', { email: response.profileObj.email });
    event.preventDefault();
  }
  function handleFail() {
    console.log('Fail');
  }

  return (
    <div>
      <h1 style={header}>Welcome to Task Manager!</h1>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2 style={desc}>The web app that fills all your project management needs...</h2>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={button}>
        <GoogleLogin
          clientId="996903865463-g40t530m1jb7bvqq2evel1dcjej6td8d.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={handleSubmit}
          onFailure={handleFail}
          cookiePolicy="single_host_origin"
        />
      </div>
    </div>
  );
}
