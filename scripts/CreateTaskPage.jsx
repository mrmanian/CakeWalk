import React, { useState } from 'react';
import { Socket } from './Socket';
import './CreateTaskPage.css';

export function Forms() {
  const [titleValue, updateTitleValue] = useState(() => '');
  const [descriptionValue, updateDescriptionValue] = useState(() => '');
  const [deadlineValue, updateDeadlineValue] = useState(() => '');

  function handleSubmit(event) {
    updateTitleValue('');
    event.preventDefault();
    updateDescriptionValue('');
    updateDeadlineValue('');
    Socket.emit('create task', {
      title: titleValue,
      description: descriptionValue,
      deadline: deadlineValue,
    });
  }

  return (

    <div id="form">

      <p>Create Task</p>
      <form onSubmit={handleSubmit}>
        <textarea className="textarea" id="TitleBox" rows="2" cols="60" placeholder="Task Title" value={titleValue} onChange={(e) => updateTitleValue(e.target.value)} />
        <br />
        <br />
        <textarea className="textarea" id="DescriptionBox" rows="15" cols="60" placeholder="Description of Task" value={descriptionValue} onChange={(e) => updateDescriptionValue(e.target.value)} />
        <br />
        <br />
        <label htmlFor="Deadline" style={{ 'font-size': '25px' }}>
          Deadline:
          <input type="date" id="deadline" name="Deadline" value={deadlineValue} onChange={(e) => updateDeadlineValue(e.target.value)} />
        </label>
        <input id="submit" type="submit" value="Create" />
      </form>
    </div>

  );
}
export default Forms;
