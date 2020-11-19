/* eslint import/no-extraneous-dependencies: */
import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';

/* eslint-disable react/prop-types */
export default function Tasks({ email }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const selectedTask = [];
  const completed = [];

  useEffect(() => {
    Socket.emit('emit', {
      email,
    });
  }, []);

  function updateTasks(data) {
    setProjects(data.projects);
    setTasks(data.tasks);
    setCompletedTasks(data.completed_tasks);
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
    Socket.emit('emit', {
      email,
    });
  }
  
  function handleComplete(event) {
    var t = document.getElementById('complete').value;
    console.log(t);
    completed.push(t);
    console.log(completed);
    
    
    Socket.emit('complete task',{
      completed,
      email,
    });
    Socket.emit('emit', {
      email,
    });
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Projects</th>
            <th>Tasks</th>
            <th>Completed</th>
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
                    <ul id="task">
                      {
                        tasks.map((task, index2) => (
                          <li key={index2}>
                            <input type="checkbox" value={task[0]} onClick={handleClick} />
                            {' '}
                            {task[0]}
                            :
                            {' '}
                            {task[1] === '' ? 'Open' : task[1]}
                            {' '}
                            Status: 
                            {' '}
                            {task[2] === 'T' ? 'Completed' : 'In Progress'}
                            {'   '}
                            <button type="submit" className="create" id="complete" value={task[0]} onClick={handleComplete}>Set Complete</button>
                          </li>
                        ))
                      }
                    </ul>
                    <button className="create" type="submit">Select Tasks</button>
                  </form>
                </td>
                <td>
                <ul id="completed-task">
                {
                  completedTasks.map((task, index3) => (
                  <li key={index3}>
                  {' '}
                  {task[0]}
                  </li>
                  
                  ))
                }
                </ul>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
