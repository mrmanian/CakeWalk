import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import ViewTask from './ViewTask';

export default function Tasks({ email }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const selectedTask = [];
  const [viewTask, setViewTask] = useState(-1);
  const [indivTask, setIndivTask] = useState(-1);

  useEffect(() => {
    Socket.emit('emit', {
      email,
    });
  }, []);

  useEffect(() => {
    Socket.on('reload', () => {
      console.log('Received reload from server');
      setViewTask(-1);
    });
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

  function unCheck() {
    const x = document.getElementsByClassName('com');
    for (let i = 0; i <= x.length; i += 1) {
      x[i].checked = false;
    }
  }

  function handleSubmit(event) {
    Socket.emit('task selection', {
      selectedTask,
      email,
    });
    Socket.emit('emit', {
      email,
    });
    event.preventDefault();
    unCheck();
  }

  function handleViewTask(event) {
    setViewTask(event.target.id);
    setIndivTask(event.target.className);
    document.getElementById('selectTaskForm').reset();
    event.preventDefault();
  }

  function handleComplete() {
    const t = selectedTask;
    Socket.emit('complete task', {
      t,
      email,
    });
    Socket.emit('emit', {
      email,
    });
  }

  if (viewTask !== -1 && indivTask !== -1) {
    return (<ViewTask tasks={tasks[viewTask][indivTask]} />);
  }

  return (
    <div>
      <table className="table table-hover table-bordered table-danger">
        <tr>
          <td>
            <table>
              <thead>
                <tr>
                  <th scope="col" className="Hder">Projects and Tasks</th>
                </tr>
              </thead>
              <tbody>
                {
                tasks.map((taskList, index2) => (
                  <tr key={index2}>
                    <td>
                      <div className="card-header pHder">{projects[index2][0]}</div>
                      <form onSubmit={handleSubmit} id="selectTaskForm" autoComplete="off">
                        <div className="serv">
                          <ul>
                            {
                            taskList.map((task, index3) => (
                              <li key={index3}>
                                <input type="checkbox" id="complete" className="com" value={task[0]} onClick={handleClick} />
                                <div className="card border-primary mb-3" styles="max-width: 18rem">
                                  <div className="card-header" id={task[2] === 'T' ? 'green_card' : 'black_card'}>{task[2] === 'T' ? 'Completed' : 'In Progress'}</div>
                                  <div className="card-body">
                                    <h5 className="card-title">{task[0]}</h5>
                                    <p className="card-text">{task[1] === '' ? 'Open' : task[1]}</p>
                                    <form onSubmit={handleViewTask} id={index2} className={index3} autoComplete="off">
                                      <button type="submit" className="create">View Task</button>
                                    </form>
                                  </div>
                                </div>
                              </li>
                            ))
                            }
                          </ul>
                        </div>
                        <button className="create" type="submit">Select Tasks</button>
                        <br />
                        <br />
                        <form onSubmit={handleComplete} autoComplete="off">
                          <button type="submit" className="create" value={selectedTask}>Set Complete</button>
                        </form>
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
