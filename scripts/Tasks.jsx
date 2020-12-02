/* eslint import/no-extraneous-dependencies: */
import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import  ViewTask  from './ViewTask';
import { Card } from 'react-bootstrap';

/* eslint-disable react/prop-types */
export default function Tasks({ email }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const selectedTask = [];
  const completed = [];
  const [viewTask, setViewTask] = useState(-1);
  useEffect(() => {
    Socket.emit('emit', {
      email,
    });
  }, []);
  
  useEffect(() => {
      Socket.on('reload', () => {
        /* eslint no-console: ["error", { allow: ["log"] }] */
        console.log('Received reload from server');
        setViewTask(-1);
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
  
  function handleViewTask(event) {
    setViewTask(event.target.id)
    document.getElementById('selectTaskForm').reset();
    event.preventDefault();
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
  
   if (viewTask != -1) {
    return (<ViewTask email={email} tasks = {tasks[viewTask]}/>);
  }
  return (
    <div>
      <table class="table table-hover table-bordered table-danger">
        <tr>
          <td>
            <table>
              <thead>
                <tr>
                  <th scope="col">Projects</th>
                </tr>
              </thead>
              <tbody>
              {
                projects.map((project, index) => (
                  <tr key={index}>
                    <td>
                      {project[0]}
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </td>
          <td>
            <table>
              <thead>
                <tr>
                  <th scope="col">Tasks</th>
                </tr>
              </thead>
              <tbody>
              {
                tasks.map((task_list, index2) => (
                  <tr key={index2}>
                    <td>
                      <form onSubmit={handleSubmit} id="selectTaskForm" autoComplete="off">
                        <ul>
                        {
                          task_list.map((task, index3) => (
                            <li>
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
                                <form onSubmit={handleViewTask} id={index2} autoComplete="off">
                                  <button type="submit" className="create" id="complete" onClick={handleComplete}>View Task</button>
                                </form>
                            </li>
                          ))
                        }
                        </ul>
                        <br />
                        <button className="create" type="submit">Select Tasks</button>
                      </form>
                    </td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
}

//<th scope="col">Tasks</th>
//<th scope="col">Completed</th>