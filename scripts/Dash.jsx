import React, { useState } from "react";
import { Socket } from './Socket';
import Tasks from './Tasks';
import CreateProjectPage from './CreateProjectPage';
import CreateTaskPage from './CreateTaskPage';
//add styling here

export default function Dash({email}) {
    const [createProject, updateCreateProject] = useState(false);
    const [createTask, updateCreateTask] = useState(false);

    function createsProject(e) {
        e.preventDefault();
        console.log('The create Project button link was clicked.');
        updateCreateProject(true);
    }
    
    function createsTasks(e) {
        e.preventDefault();
        console.log('The create Task button link was clicked.');
        updateCreateTask(true);
    }
    
    if(createProject){
        Socket.emit('get users');
        return(<CreateProjectPage />);
    }
    if(createTask){
        return(<CreateTaskPage />);
    }
    
    return(
        <div>
            <h1>Task Manager</h1>
            <br />
            <br />
            <button onClick={createsProject}>Create Project</button> 
            <br />
            <br />
            <button onClick={createsTasks}>Create Task</button> 
            <br />
            <br />
            <Tasks email={email}/>
        </div>
    );
}
