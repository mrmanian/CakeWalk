import React, { useState } from "react";
import { Socket } from './Socket';
import Tasks from './Tasks';
import  CreateProjectPage from './CreateProjectPage';

export default function Dash({email}) {
    const [createProject, updateCreateProject] = React.useState(false);
    
    function createsProject(e) {
    e.preventDefault();
    console.log('The createProject button link was clicked.');
    updateCreateProject(true);
    
  }
  if(createProject){
    return(<CreateProjectPage />)
  }
    return(
        <div>
            <h1>Task Manager</h1>
            <br />
            <br />
            <button onClick={createsProject}>Create Project</button> 
            <br />
            <br />
            <Tasks />
        </div>
    );
}