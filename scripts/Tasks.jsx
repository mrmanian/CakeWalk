import React, { useState } from "react";
import { Socket } from './Socket';

export default function Tasks() {
    const [projects, setProjects] = React.useState();
    const [tasks, setTasks] = React.useState();
    
    function getTasks() {
        React.useEffect(() => {
        Socket.on('task list', updateTasks);
            return () => {
                Socket.off('task list', updateTasks);
            };
        });
    }

    function updateTasks(data) {
        console.log(`Received projects and tasks from the server`);
        setProjects(data.projects)
        setTasks(data.tasks)
    }

    getTasks();
    
    return(
        <div>
            <table>
                <tr>
                    <th>Projects</th>
                    <th>Tasks</th>
                </tr>
                {
                    projects.map((project, index) => {
                        return(
                            <tr>
                                <td>{project[0]}</td>
                                <td>
                                    <ul>
                                    {
                                        tasks.map((task, index2) => {
                                            if (project[1] == task[1]) {
                                                return(
                                                    <li>{task[0]}</li>
                                                );
                                            }
                                        })    
                                    }
                                    </ul>
                                </td>
                            </tr>
                        );
                    })
                }
            </table>
        </div>
    );
}