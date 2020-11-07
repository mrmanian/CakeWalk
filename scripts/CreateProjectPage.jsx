import React from 'react';

import { Socket } from './Socket';

import './CreateProjectPage.css';

export default function CreateProjectPage() {
    let groupCode = '';

    function createCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i += 1) {
            groupCode += characters.charAt(Math.floor(Math.random() * 62));
        }

        return groupCode;
    }

    function handleSubmit(event) {
        const projectName = document.getElementById('name').value;
        const projectDescription = document.getElementById('description').value;

        Socket.emit('create project', {
            projectName,
            projectDescription,
            groupCode,
        });

        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        event.preventDefault();
    }

    return (
        <div id="form">
            <h1 className="size">
                Create Project
                <span className="right">
                    Group Code:
                    {' '}
                    {createCode()}
                </span>
            </h1>
            <form onSubmit={handleSubmit} autoComplete="off">
                <br />
                <br />
                <textarea className="textarea" id="name" placeholder="Project Name" />
                <br />
                <br />
                <textarea className="textarea" id="description" placeholder="Project Description" />
                <br />
                <br />
                <br />
                <button id="submit" type="submit">Create Project</button>
            </form>
        </div>
    );
}
