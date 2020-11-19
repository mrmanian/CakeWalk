import React from 'react';
import './Login-Register.css';

export default function Register() {
  return (
    <div className="box-container">
      <div className="head">Register</div>
      <div>
        <div className="login-image">
          <img src="https://aleragroup.com/wp-content/uploads/2019/06/featured-1560781094-GettyImages-941665020.jpg" alt="Not found" />
        </div>
        <br />
        <form className="login-form" autoComplete="off">
          <label htmlFor="Username">Username</label>
          <input type="text" name="Username" placeholder="Username" required />
          <label htmlFor="Email">Email</label>
          <input type="text" name="Email" placeholder="Email" required />
          <label htmlFor="Password">Password</label>
          <input type="password" name="Password" placeholder="Password" autoComplete="on" required />
          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
}
