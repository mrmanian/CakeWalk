import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateProjectPage.css';

export default function CreateProjectPage({ email }) {
  const [code, setCode] = useState('');
  const [users, setUsers] = useState([]);
  const [profilePic, setProfilePic] = useState([]);
  const [formSent, setFormSent] = useState(false);
  const [cancel, setCancel] = useState(false);
  let groupCode = '';
  const selectedUsers = [];

  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i += 1) {
      groupCode += characters.charAt(Math.floor(Math.random() * 62));
    }
    setCode(groupCode);
  }, []);

  useEffect(() => {
    Socket.on('get user list', (data) => {
      setUsers(data.all_users);
      setProfilePic(data.all_profile_pics);
    });
    return () => {
      Socket.off('get user list', (data) => {
        setUsers(data.all_users);
        setProfilePic(data.all_profile_pics);
      });
    };
  }, []);

  function handleSubmit() {
    const projectName = document.getElementById('name').value;
    const projectDescription = document.getElementById('description').value;

    Socket.emit('create project', {
      projectName,
      projectDescription,
      code,
      selectedUsers,
      email,
    });
    setFormSent(true);
  }

  function handleClick(event) {
    const { checked, value } = event.target;

    if (checked) {
      selectedUsers.push(value);
    } else {
      for (let i = 0; i < selectedUsers.length; i += 1) {
        if (selectedUsers[i] === value) {
          selectedUsers.splice(i, 1);
        }
      }
    }
  }

  if (formSent) {
    return (<Dash email={email} />);
  }

  function handleCancel() {
    setCancel(true);
  }

  if (cancel) {
    return (<Dash email={email} />);
  }

  return (
    <div id="form">
      <h1 className="size">
        Create Project
        <span className="right">
          Group Code:
          {' '}
          {code}
        </span>
      </h1>

      <form onSubmit={handleSubmit} autoComplete="off">
        <br />
        <textarea className="textarea" id="name" placeholder="Project Name" required />
        <br />
        <br />
        <textarea className="textarea" id="description" placeholder="Project Description" required />
        <label htmlFor="Users" className="right pad">
          &nbsp;&nbsp;
          Select users to add:
          <br />
          <br />
          <br />
          {users.map((user, index) => (
            <li className="list" key={index.id}>
              <input type="checkbox" name="Users" value={user} onClick={handleClick} />
              {' '}
              <img className="profilePic" src={profilePic[index]} alt="Invalid pic link" />
              {' '}
              {user}
              <br />
            </li>
          ))}
        </label>
        <br />
        <button id="submit" type="submit">Create</button>
        <button id="submit" type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}
