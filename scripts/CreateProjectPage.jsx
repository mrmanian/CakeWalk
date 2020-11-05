import React from 'react';

import { Socket } from './Socket';

export default function CreateProjectPage() {

    function handleSubmit(event) {
        const projectName = document.getElementById('name').value;
        const projectDescription = document.getElementById('description').value;

        Socket.emit('create project', {
            'projectName': projectName,
            'projectDescription': projectDescription,
        });

        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        event.preventDefault();
    }

    return (
        <div>
            <h1>Create Project</h1>
            <form onSubmit={handleSubmit} autoComplete="off">
                <input type="text" id="name" placeholder="Project Name..." />
                <input type="text" id="description" placeholder="Project Description..." />
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
}
