import React from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { Socket } from './Socket';

export default function GoogleButton() {
  function handleSubmit(response) {
    const { name } = response.profileObj;
    const { email } = response.profileObj;
    const picUrl = response.profileObj.imageUrl;
    Socket.emit('newlogin', { uname: name, password: '',imageurl: picUrl, email });
  }

  function handleFailure() {
    return (null);
  }

  return (
    <GoogleLogin
      clientId="820684354318-tlcrjakf8qm4o0ln9e9r0qqoh0kq2tc6.apps.googleusercontent.com"
      render={(renderProps) => (
        <GoogleLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} />
      )}
      onSuccess={handleSubmit}
      onFailure={handleFailure}
      cookiePolicy="single_host_origin"
    />
  );
}
