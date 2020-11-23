import React, { useState } from 'react';
import Dash from './Dash';
import Login from './Login';
import Register from './Register';
import './LoginPage.css';

export default function LoginPage({ state, email }) {
  const [isLoginActive, setIsLoginActive] = useState(true);

  function handleClick() {
    setIsLoginActive(!isLoginActive);
  }

  if (state) {
    return (<Dash email={email} />);
  }

  return (
    <div>
      <h1 className="title">Welcome to Task Manager!</h1>
      <br />
      <div className="Login">
        <div className="login">
          <div className="containerr">
            {isLoginActive ? <Login /> : <Register />}
          </div>
          {isLoginActive
            ? (
              <div role="button" tabIndex={0} className="right-side" onClick={handleClick} onKeyDown={handleClick}>
                <div>
                  <div className="text-right">Register</div>
                </div>
              </div>
            )
            : (
              <div role="button" tabIndex={0} className="left-side" onClick={handleClick} onKeyDown={handleClick}>
                <div>
                  <div className="text-left">Login</div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
