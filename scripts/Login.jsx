import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import { Socket } from './Socket';
import GoogleButton from './GoogleButton';
import FacebookButton from './FacebookButton';
import './Login-Register.css';

export default function Login() {
  const [verified, setVerified] = useState(false);
  let email = '';

  function handleClick() {
    if (document.getElementById('Email').value === '') {
      alert('Enter valid email address!');
    } else {
      console.log(document.getElementById('Email').value);
      document.getElementById('Email').value = '';
    }
  }

  function handleSubmit(event) {
    email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    Socket.emit('verifylogin', { email, password });
    event.preventDefault();
  }

  useEffect(() => {
    Socket.on('login_status', (data) => {
      if (data.loginStatus) {
        setVerified(true);
      } else {
        alert('Invalid login! Try again.');
      }
    });
  }, []);

  if (verified) {
    return (<LoginPage state={verified} email={email} />);
  }

  return (
    <div className="box-container">
      <div className="head">Login</div>
      <div>
        <div className="login-image">
          <img src="https://aleragroup.com/wp-content/uploads/2019/06/featured-1560781094-GettyImages-941665020.jpg" alt="Not found" />
        </div>
        <br />
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="Email">Email</label>
          <input type="text" id="Email" name="Email" placeholder="Email" required />
          <label htmlFor="Password">Password</label>
          <input type="password" id="Password" name="Password" placeholder="Password" autoComplete="on" required />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="forgot" onClick={handleClick} onKeyDown={handleClick}>Forgot Password</p>
        <hr />
        <p className="or">Or continue with your social account</p>
        <div className="socials">
          <GoogleButton />
          <FacebookButton />
        </div>
      </div>
    </div>
  );
}
