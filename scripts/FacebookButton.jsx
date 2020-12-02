import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { Socket } from './Socket';

export default function FacebookButton() {
  function handleSubmit(response) {
    const { name } = response;
    const { email } = response;
    const picUrl = response.picture.data.url;
    Socket.emit('newlogin', { uname: name, password: 'Used Facebook Login', imageurl: picUrl, email });
  }

  function handleFailure() {
    return (null);
  }

  return (
    <FacebookLogin
      appId="1218688188501565"
      autoLoad={false}
      fields="name,email,picture"
      callback={handleSubmit}
      onFailure={handleFailure}
      render={(renderProps) => (
        <FacebookLoginButton onClick={renderProps.onClick} />
      )}
    />
  );
}
