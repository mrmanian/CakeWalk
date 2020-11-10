import React, { useState } from "react";
import { Socket } from './Socket';

export default function Tasks() {
    const [projects, setProjects] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    
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
                            <tr>
                                <td>{project}</td>
                                <td>
                                    <ul>
                                    {
                                        tasks.map((task, index2) => {
                                            return(
                                                <li>{task}</li>
                                            );
                                        })    
                                    }
                                    </ul>
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