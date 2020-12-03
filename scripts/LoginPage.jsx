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
      <input type="image" className="top-logo" src="https://i.imgur.com/JBNbaE7.gif" alt="App Logo" />
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
