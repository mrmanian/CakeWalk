import React, { useState } from "react";
import { Socket } from './Socket';
import Tasks from './Tasks';

export default function Dash({email}) {
    return(
        <div>
            <h1>Task Manager</h1>
            <br />
            <br />
            <br />
            <br />
            <Tasks />
        </div>
    );
}