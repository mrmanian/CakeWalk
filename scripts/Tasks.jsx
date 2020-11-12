/* eslint import/no-extraneous-dependencies: */
import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
/* eslint-disable react/prop-types */ 
export default function Tasks({ email }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const selectedTask = [];

  useEffect(() => {
    Socket.emit('emit');
  }, []);

  function updateTasks(data) {
    setProjects(data.projects);
    setTasks(data.tasks);
  }
  function getTasks() {
    useEffect(() => {
      Socket.on('task list', updateTasks);
      return () => {
        Socket.off('task list', updateTasks);
      };
    });
  }

  getTasks();

  function handleClick(event) {
    const { checked, value } = event.target;
    if (checked) {
      selectedTask.push(value);
    } else {
      for (let i = 0; i < selectedTask.length; i += 1) {
        if (selectedTask[i] === value) {
          selectedTask.splice(i, 1);
        }
      }
    }
  }

  function handleSubmit(event) {
    Socket.emit('task selection', {
      selectedTask,
      email,
    });
    document.getElementById('selectTaskForm').reset();
    event.preventDefault();
  }
  
  //id="submit"

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Projects</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {
                    projects.map((project, index) => (
                      <tr key={index}>
                        <td>
                          {project}
                        </td>
                        <td>
                          <form onSubmit={handleSubmit} id="selectTaskForm" autoComplete="off">
                            <ul id='task'>
                              {
                                        tasks.map((task, index2) => (
                                          <li key={index2}>
                                            <input type="checkbox" value={task} onClick={handleClick} />
                                            {' '}
                                            {task}
                                          </li>
                                        ))
                                    }
                            </ul>
                            <button  className='create' type="submit">Select Tasks</button>
                          </form>
                        </td>
                      </tr>
                    ))
                }
        </tbody>
      </table>
    </div>
  );
}
