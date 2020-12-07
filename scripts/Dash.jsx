import React, { useState } from 'react';
import { Socket } from './Socket';
import Tasks from './Tasks';
import CreateProjectPage from './CreateProjectPage';
import CreateTaskPage from './CreateTaskPage';
import LandingPage from './LandingPage';
import ProfilePage from './ProfilePage';
import './Dash.css';

export default function Dash({ email }) {
  const [createProject, updateCreateProject] = useState(false);
  const [createTask, updateCreateTask] = useState(false);

  function createsProject(e) {
    e.preventDefault();
    console.log('The create Project button link was clicked.');
    updateCreateProject(true);
  }

  function createsTasks(e) {
    e.preventDefault();
    console.log('The create Task button link was clicked.');
    updateCreateTask(true);
  }

  function handleRefresh(e) {
    e.preventDefault();
    Socket.emit('emit', {
      email,
    });
  }

  if (createProject) {
    Socket.emit('emit', {
      email,
    });
    return (<CreateProjectPage email={email} />);
  }

  if (createTask) {
    return (<CreateTaskPage email={email} />);
  }

  return (
    <div id="head">
      <h1 id="title">Cakewalk</h1>
      <LandingPage email={email} />
      <ProfilePage email={email} />
      <br />
      <br />
      <div id="btn">
        <button type="button" className="create" onClick={createsProject}>Create Project</button>
        <div id="divider" />
        <button type="button" className="create" onClick={createsTasks}>Create Task</button>
        <div id="divider" />
        <button type="button" className="create" onClick={handleRefresh}>Refresh Data</button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <Tasks email={email} />
    </div>
  );
}
