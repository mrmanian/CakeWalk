import React, { useState } from 'react';
import Dash from './Dash';
import Login from './Login';
import { Socket } from './Socket';
import CreateProjectPage from './CreateProjectPage';

export default function Content() {
    const [login, setLogin] = React.useState(false);
    let email = '';
     
    function getLogin() {
        React.useEffect(() => {
            Socket.on('login_status', updateLogin);
            return () => {
                Socket.off('login_status', updateLogin);
            };
        });
    }

    function updateLogin(data) {
        console.log(`Received login status from server: ${data.loginStatus}`);
        setLogin(data.loginStatus);
    }
    
    getLogin();
    
    if (login) {
        React.useEffect(() => {
            Socket.on('connected', (data) => {
             /* eslint no-console: ["error", { allow: ["log"] }] */
            console.log(`Received user's email from server: ${data.email}`);
            email = data.email;
            });
        }, []);
        return (<Dash email = {email}/>);   
    }
    
    return (<Login />);
}
