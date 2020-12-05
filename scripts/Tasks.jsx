/* eslint import/no-extraneous-dependencies: */
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Socket } from './Socket';
import ViewTask from './ViewTask';

/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
export default function Tasks({ email }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const selectedTask = [];
  const completed = [];
  const [viewTask, setViewTask] = useState(-1);
  const [indivTask, setIndivTask] = useState(-1);
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
    console.log(selectedTask)
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
    setViewTask(event.target.id);
    setIndivTask(event.target.className);
    document.getElementById('selectTaskForm').reset();
    event.preventDefault();
  }

  function handleComplete() {
    const t = selectedTask;
    console.log(t);

    Socket.emit('complete task', {
      t,
      email,
    });
    Socket.emit('emit', {
      email,
    });
  }

  if (viewTask !== -1 && indivTask !== -1) {
    return (<ViewTask email={email} tasks={tasks[viewTask][indivTask]} />);
  }
  return (
    <div>
      <table className="table table-hover table-bordered table-danger">
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
                tasks.map((taskList, index2) => (
                  <tr key={index2}>
                    <td>
                      <form onSubmit={handleSubmit} id="selectTaskFor" autoComplete="off">
                        <ul>
                          {
                          taskList.map((task, index3) => (
                            <li key={index3}>
                              <input type="checkbox" id="complete" value={task[0]} onClick={handleClick} />
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
                              <form onSubmit={handleComplete} id="selectTaskForm" autoComplete="off">
                                <button type="submit" className="create" value={selectedTask}>Set Complete</button>
                              </form>
                              <form onSubmit={handleViewTask} id={index2} className={index3} autoComplete="off">
                                <button type="submit" className="create">View Task</button>
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
          <td>
            <table>
              <thead>
                <tr>
                  <th scope="col">Completed</th>
                </tr>
              </thead>
              <tbody>
                {
                completedTasks.map((compList, index4) => (
                  <tr key={index4}>
                    <td>
                      <ul id="completed-task">
                        {
                        compList.map((task, index3) => (
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
          </td>
        </tr>
      </table>
    </div>
  );
}
