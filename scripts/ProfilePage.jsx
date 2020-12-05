import React, { useState, useEffect } from 'react';
import SlidingPane from 'react-sliding-pane';
import { Socket } from './Socket';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import './ProfilePage.css';

export default function ProfilePage({ email }) {
  const [state, setState] = useState({ isPaneOpen: false });
  const [change, setChange] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [nrole, setNrole] = useState('');

  useEffect(() => {
    Socket.emit('data', { email });
  }, []);

  useEffect(() => {
    Socket.on('data', (data) => {
      setUsername(data.username);
      if (data.password[0][0] === 'Used Facebook Login') {
        setPassword(data.password);
        setChange(false);
      } else if (data.password[0][0] === 'Used Google Login') {
        setPassword(data.password);
        setChange(false);
      } else {
        setPassword(data.password);
      }
      setNrole(data.role);
      setProfileImg(data.profileImg);
      setTotalProjects(data.totalProjects);
      setTotalTasks(data.totalTasks);
      setCompletedTasks(data.completedTasks);
    });
  }, []);

  function handleNewPic(event) {
    const image = document.getElementById('Pic').value;
    setProfileImg(image);
    Socket.emit('update profile pic', {
      email,
      image,
    });
    document.getElementById('Pic').value = '';
    event.preventDefault();
  }

  function handleNewRole(event) {
    const role = document.getElementById('Role').value;
    setNrole(role);
    Socket.emit('update role', {
      email,
      role,
    });
    document.getElementById('Role').value = '';
    event.preventDefault();
  }

  function handleUpdatePass(event) {
    const newPass = document.getElementById('Pass').value;
    setPassword(newPass);
    Socket.emit('update password', {
      email,
      new_pass: newPass,
    });
    document.getElementById('Pass').value = '';
    event.preventDefault();
  }

  function handleLogout() {
    window.location.reload();
    return false;
  }

  return (
    <div>
      <input type="image" className="prof_btn" alt="Profile Pic" src={profileImg} onClick={() => setState({ isPaneOpen: true })} />
      <SlidingPane
        isOpen={state.isPaneOpen}
        title="Profile Page"
        width="36vw"
        onRequestClose={() => {
          setState({ isPaneOpen: false });
        }}
      >
        <div className="top_heading">
          <img className="prof_pic" src={profileImg} alt="Profile Pic" />
          <span className="span_header">
            <h2>{username}</h2>
            <h4>
              ~
              {nrole}
            </h4>
          </span>
        </div>
        <hr />
        <form className="prof-form" onSubmit={handleNewRole} autoComplete="off">
          <label htmlFor="Role">
            Enter your role:
            {' '}
            <input type="text" id="Role" name="Role" placeholder="Enter role" required />
            {' '}
            <button type="submit" className="prof-button">Enter</button>
          </label>
        </form>
        <form className="prof-form" onSubmit={handleNewPic} autoComplete="off">
          <label htmlFor="Pic">
            Change profile picture:
            {' '}
            <input type="text" id="Pic" name="Pic" placeholder="Enter image url" required />
            {' '}
            <button type="submit" className="prof-button">Change</button>
          </label>
        </form>

        <hr />
        <h2 className="prof_section">Personal Information</h2>
        <h6>
          Email:
          {' '}
          {email}
        </h6>
        <h6>
          Password:
          {' '}
          {password}
        </h6>
        <br />
        {change
          ? (
            <form className="prof-form" onSubmit={handleUpdatePass} autoComplete="off">
              <label htmlFor="Pass">
                Update password:
                {' '}
                <input type="text" id="Pass" name="Pass" placeholder="Enter new password" required />
                {' '}
                <button type="submit" className="prof-button">Update</button>
              </label>
            </form>
          )
          : (
            <div />
          )}
        <hr />
        <h2 className="prof_section">Statistics</h2>
        <h6>
          Total Projects:
          {' '}
          {totalProjects}
        </h6>
        <h6>
          Total Tasks:
          {' '}
          {totalTasks}
        </h6>
        <h6>
          Completed Tasks:
          {' '}
          {completedTasks}
        </h6>
        <button type="submit" className="center prof-button" onClick={handleLogout}>Logout</button>
      </SlidingPane>
    </div>
  );
}
