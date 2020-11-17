/* eslint import/no-extraneous-dependencies: */
import React, { useState } from 'react';
import { Socket } from './Socket';
import Tasks from './Tasks';
import CreateProjectPage from './CreateProjectPage';
import CreateTaskPage from './CreateTaskPage';
import './Dash.css';
import LandingPage from './LandingPage';
/* eslint-disable react/prop-types */

export default function Dash({ email }) {
  const [createProject, updateCreateProject] = useState(false);
  const [createTask, updateCreateTask] = useState(false);
  const [landpage, updateLandPage] = useState(false);

  function createsProject(e) {
    e.preventDefault();
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('The create Project button link was clicked.');
    updateCreateProject(true);
  }

  function createsTasks(e) {
    e.preventDefault();
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('The create Task button link was clicked.');
    updateCreateTask(true);
  }
  
  function handleAbout(e){
    e.preventDefault();
    console.log("Hit about");
    updateLandPage(true);
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
  if(landpage){
    return (<LandingPage email={email} />);
  }

  return (
    <div id="head">
      <h1 id="title">Task Manager</h1>
      <button type="button" onClick={handleAbout}>About</button>
      <br />
      <br />
      <div id="btn">
        <button type="button" className="create" onClick={createsProject}>Create Project</button>
        <div id="divider" />
        <button type="button" className="create" onClick={createsTasks}>Create Task</button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <Tasks email={email} />
    </div>
  );
}
