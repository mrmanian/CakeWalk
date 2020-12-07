import React, { useState } from 'react';
import Linkify from 'react-linkify';
import { Socket } from './Socket';
import './ViewTask.css';

export default function ViewTask({ tasks }) {
  const [cancel, setCancel] = useState(false);

  function handleCancel() {
    console.log('Hit Cancel');
    setCancel(true);
  }

  if (cancel) {
    Socket.emit('reload');
  }

  return (
    <div id="vt">
      <h1 id="header">View Task</h1>
      <br />
      <p>
        Title:
        {' '}
        {tasks[0]}
      </p>
      <Linkify>
        <p>
          Description:
          {' '}
          {tasks[3]}
        </p>
      </Linkify>
      <p>
        Date:
        {' '}
        {tasks[4]}
      </p>
      <button id="submit" type="button" onClick={handleCancel}>Go Back</button>
    </div>
  );
}
