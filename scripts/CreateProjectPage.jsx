import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import Dash from './Dash';
import './CreateProjectPage.css';

export default function CreateProjectPage() {
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]);
    const [profilePic, setProfilePic] = useState([]);
    const [formSent, setFormSent] = useState(false);
    let groupCode = '';
    const selectedUsers = [];

    // Creates unique group code
    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i += 1) {
            groupCode += characters.charAt(Math.floor(Math.random() * 62));
        }
        setCode(groupCode);
    }, []);

    // Gets list of users to select from
    useEffect(() => {
        Socket.on('get user list', (data) => {
            setUsers(data.all_users);
            setProfilePic(data.all_profile_pics);
        });
        return () => {
            Socket.off('get user list', (data) => {
                setUsers(data.all_users);
                setProfilePic(data.all_profile_pics);
            });
        };
    }, []);

    // Gathers submitted information and sends to server
    function handleSubmit(event) {
        const projectName = document.getElementById('name').value;
        const projectDescription = document.getElementById('description').value;
        Socket.emit('create project', {
            projectName,
            projectDescription,
            code,
            selectedUsers,
        });

        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        event.preventDefault();
        setFormSent(true);
    }

    // Handles user selection checkboxes
    function handleClick(event) {
        const { checked, value } = event.target;
        if (checked) {
            selectedUsers.push(value);
        } else {
            for (let i = 0; i < selectedUsers.length; i += 1) {
                if (selectedUsers[i] === value) {
                    selectedUsers.splice(i, 1);
                }
            }
        }
    }

    // Redirect page back to dashboard after form submit
    if (formSent) {
        return (<Dash />);
    }

    return (
        <div id="form">
            <h1 className="size">
                Create Project
                <span className="right">
                    Group Code:
                    {' '}
                    {code}
                </span>
            </h1>

            <form onSubmit={handleSubmit} autoComplete="off">
                <br />
                <textarea className="textarea" id="name" placeholder="Project Name" />
                <br />
                <br />
                <textarea className="textarea" id="description" placeholder="Project Description" />
                <label htmlFor="Users" className="right pad">
                    &nbsp;&nbsp;
                    Select users to add:
                    <br />
                    <br />
                    <br />
                    {users.map((user, index) => (
                        <li className="list" key={index.id}>
                            <input type="checkbox" name="Users" value={user} onClick={handleClick} />
                            {' '}
                            <img className="profilePic" src={profilePic[index]} alt="Invalid pic link" />
                            {' '}
                            {user}
                            <br />
                        </li>
                    ))}
                </label>
                <br />
                <button id="submit" type="submit">Create</button>
            </form>
        </div>
    );
}
