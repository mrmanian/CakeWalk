import React from 'react';
import GoogleButton from './GoogleButton';
import FacebookButton from './FacebookButton';
import './Login-Register.css';

export default function Login() {
  return (
    <div className="box-container">
      <div className="head">Login</div>
      <div>
        <div className="login-image">
          <img src="https://aleragroup.com/wp-content/uploads/2019/06/featured-1560781094-GettyImages-941665020.jpg" alt="Not found" />
        </div>
        <br />
        <form className="login-form" autoComplete="off">
          <label htmlFor="Email">Email</label>
          <input type="text" id="Email" name="Email" placeholder="Email" required />
          <label htmlFor="Password">Password</label>
          <input type="password" id="Password" name="Password" placeholder="Password" autoComplete="on" required />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="forgot">Forgot Password</p>
        <hr />
        <p className="or">Or continue with your social account</p>
        <div className="socials">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
}
