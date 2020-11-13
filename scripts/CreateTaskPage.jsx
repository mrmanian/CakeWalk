/* eslint import/no-extraneous-dependencies: */
import React, { useState } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateTaskPage.css';

/* eslint-disable react/prop-types */
export default function CreateTaskPage({ email }) {
  const [titleValue, updateTitleValue] = useState('');
  const [descriptionValue, updateDescriptionValue] = useState('');
  const [deadlineValue, updateDeadlineValue] = useState('');
  const [formSent, setFormSent] = useState(false);

  // Gathers submitted information and sends to server
  function handleSubmit(event) {
    updateTitleValue('');
    event.preventDefault();
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

  // Redirect page back to dashboard after form submit
  if (formSent) {
    return (<Dash email={email} />);
  }

  return (
    <div id="form">
      <h1 className="size">
        Create Task
      </h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <br />
        <textarea className="textarea" id="name" placeholder="Task Name" value={titleValue} onChange={(e) => updateTitleValue(e.target.value)} />
        <br />
        <br />
        <textarea className="textarea" id="description" placeholder="Task Description" value={descriptionValue} onChange={(e) => updateDescriptionValue(e.target.value)} />
        <br />
        <label htmlFor="Deadline" className="label">
          Deadline:
          {' '}
          <input type="date" id="deadline" name="Deadline" value={deadlineValue} onChange={(e) => updateDeadlineValue(e.target.value)} />
        </label>
        <button id="submit" type="submit">Create</button>
      </form>
    </div>
  );
}
