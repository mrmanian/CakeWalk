import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateTaskPage.css';

export default function CreateTaskPage({ email }) {
  const [titleValue, updateTitleValue] = useState('');
  const [descriptionValue, updateDescriptionValue] = useState('');
  const [deadlineValue, updateDeadlineValue] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    Socket.emit('emit', {
      email,
    });
  }, []);
  
  useEffect(() => {
    Socket.on('proj list', (data) => {
      setProjects(data.projs);
    });
    return () => {
      Socket.off('proj list', (data) => {
        setProjects(data.projs);
      });
    };
  }, []);

  function handleSubmit() {
    updateTitleValue('');
    updateDescriptionValue('');
    updateDeadlineValue('');

    Socket.emit('create task', {
      email,
      title: titleValue,
      description: descriptionValue,
      deadline: deadlineValue,
    });
    setFormSent(true);
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
  
  console.log('--------');
  console.log({projects});

  return (
    <div id="form">
      <h1 className="size">
        Create Task
      </h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <br />
        <textarea className="textarea" id="name" placeholder="Task Name" value={titleValue} onChange={(e) => updateTitleValue(e.target.value)} required />
        <br />
        <br />
        <textarea className="textarea" id="description" placeholder="Task Description" value={descriptionValue} onChange={(e) => updateDescriptionValue(e.target.value)} required />
        <label>Select project:</label>
        <select name="cars" id="cars">
        {
          projects.map((project, index) => (
            <option value={project[0]} key={index}>{project[0]}</option>
          ))
        }
        </select>
        <br />
        <label htmlFor="Deadline" className="label">
          Deadline:
          {' '}
          <input type="date" id="deadline" name="Deadline" value={deadlineValue} onChange={(e) => updateDeadlineValue(e.target.value)} required />
        </label>
        <button id="submit" type="submit">Create</button>
        <button id="submit" type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}
