import React, { useState } from "react";
import { Socket } from './Socket';

export default function Dash() {
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
            <h1>Task Manager</h1>
            <br></br>
        </div>
    );
}