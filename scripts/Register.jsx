import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import { Socket } from './Socket';
import './Login-Register.css';
/* eslint-disable jsx-a11y/label-has-associated-control */
export default function Register() {
  const [formSent, setFormSent] = useState(false);
  let email = '';

  function handleSubmit(event) {
    const name = document.getElementById('Username').value;
    email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    Socket.emit('newlogin', {
      uname: name, password, imageurl: 'https://www.siliconlegal.com/wp-content/uploads/2019/01/Profile-picture-default.png', email,
    });
    event.preventDefault();
  }

  useEffect(() => {
    Socket.on('login_status', (data) => {
      if (data.loginStatus) {
        setFormSent(true);
      }
    });
  }, []);

  if (formSent) {
    return (<LoginPage state={formSent} email={email} />);
  }

  return (
    <div className="box-container">
      <div className="head">Register</div>
      <div>
        <div className="login-image">
          <img src="https://aleragroup.com/wp-content/uploads/2019/06/featured-1560781094-GettyImages-941665020.jpg" alt="Not found" />
        </div>
        <br />
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="Username">Username</label>
          <input type="text" id="Username" name="Username" placeholder="Username" required />
          <label htmlFor="Email">Email</label>
          <input type="text" id="Email" name="Email" placeholder="Email" required />
          <label htmlFor="Password">Password</label>
          <input type="password" id="Password" name="Password" placeholder="Password" autoComplete="on" required />
          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
}
