import React, { useState } from 'react';
import Dash from './Dash';
import Login from './Login';
import { Socket } from './Socket';

export default function Content() {
    const [login, setLogin] = React.useState(false);
    const [email, setEmail] = React.useState('');
     
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
        setEmail(data.email);
    }
    
    getLogin();
    
    if (login) {
        return (<Dash email = {email}/>);   
    }
    
    return (<Login />);
}
