import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateTaskPage.css';

export default function CreateTaskPage() {
    const [titleValue, updateTitleValue] = useState('');
    const [descriptionValue, updateDescriptionValue] = useState('');
    const [deadlineValue, updateDeadlineValue] = useState('');
    const [formSent, setFormSent] = useState(false);
    let email = '';

    function serverData() {
        useEffect(() => {
            Socket.on('connected', (data) => {
                /* eslint no-console: ["error", { allow: ["log"] }] */
                console.log(`Received user's email from server: ${data.email}`);
                email = data.email;
            });
        }, []);
    }

    // Gathers submitted information and sends to server
    function handleSubmit(event) {
        updateTitleValue('');
        event.preventDefault();
        updateDescriptionValue('');
        updateDeadlineValue('');
        Socket.emit('create task', {
            email: 'cs490.projectmanager@gmail.com',
            title: titleValue,
            description: descriptionValue,
            deadline: deadlineValue,
        });
        setFormSent(true);
    }

    serverData();

    // Redirect page back to dashboard after form submit
    if (formSent) {
        return (<Dash />);
    }

    return (
        <div id="form">
            <h1 className="size">
                Create Task
            </h1>
            <form onSubmit={handleSubmit} autoComplete="off">
                <br />
                <textarea className="textarea" id="name" placeholder="Task Name" value={titleValue} onChange={(e) => updateTitleValue(e.target.value)} />
                <br />
                <br />
                <textarea className="textarea" id="description" placeholder="Task Description" value={descriptionValue} onChange={(e) => updateDescriptionValue(e.target.value)} />
                <br />
                <label htmlFor="Deadline" className="label">
                    Deadline:
                    {' '}
                    <input type="date" id="deadline" name="Deadline" value={deadlineValue} onChange={(e) => updateDeadlineValue(e.target.value)} />
                </label>
                <button id="submit" type="submit">Create</button>
            </form>
        </div>
    );
}
