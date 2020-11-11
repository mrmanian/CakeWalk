import React, { useState } from "react";
import { Socket } from './Socket';
import CreateTaskPage from './CreateTaskPage';

export default function Tasks({email}) {
    const [projects, setProjects] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const selectedTask = [];
    
    function getTasks() {
        React.useEffect(() => {
        Socket.on('task list', updateTasks);
            return () => {
                Socket.off('task list', updateTasks);
            };
        });
    }

    function updateTasks(data) {
        setProjects(data.projects);
        setTasks(data.tasks);
    }

    getTasks();
    
    function handleClick(event){
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
        email
        });
         
    }
    
    function createTask(e) {
        e.preventDefault();
        console.log('The createTask button link was clicked.');
        return(<CreateTaskPage />);
    }
    
    return(
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
                    projects.map((project, index) => {
                        return(
                            <tr key={index}>
                                <td>
                                    {project}
                                    <button onClick={createTask}>Create Task</button>
                                </td>
                                <td>
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <ul>
                                    {
                                        tasks.map((task, index2) => {
                                            return(
                                                <li key={index2}>
                                                <input type="checkbox" value={task} onClick={handleClick}/>
                                                {' '}
                                                {task}
                                                </li>
                                            );
                                        })    
                                    }
                                    </ul>
                                    <button id="submit" type="submit">Select Tasks</button>
                                 </form>
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
}