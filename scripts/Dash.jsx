import React, { useState } from "react";
import { Socket } from './Socket';
import Tasks from './Tasks';
import CreateProjectPage from './CreateProjectPage';
import CreateTaskPage from './CreateTaskPage';
import './Dash.css';

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
        return(<CreateProjectPage email = {email}/>);
    }
    if(createTask){
        return(<CreateTaskPage email={email}/>);
    }
    
    return(
        <div id='head'>
            <h1 id='title'>Task Manager</h1>
            <br />
            <br />
            <div id='btn'>
                <button className='create' onClick={createsProject}>Create Project</button>
                <div id='divider' />
                <button className='create' onClick={createsTasks}>Create Task</button>
            </div>
            <br />
            <br />
            <br />
            <br />
            <Tasks email = {email}/>
        </div>
    );
}
