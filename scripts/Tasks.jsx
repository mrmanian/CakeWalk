import React, { useState, useEffect } from "react";
import { Socket } from './Socket';

export default function Tasks({email}) {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const selectedTask = [];
    
    useEffect(() => {
        Socket.emit('emit');
    }, []); 
    
    function getTasks() {
        useEffect(() => {
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
