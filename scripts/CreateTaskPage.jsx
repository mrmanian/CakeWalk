import React, { useState } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateTaskPage.css';

export default function CreateTaskPage({ email }) {
  const [titleValue, updateTitleValue] = useState('');
  const [descriptionValue, updateDescriptionValue] = useState('');
  const [deadlineValue, updateDeadlineValue] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [cancel, setCancel] = useState(false);

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
