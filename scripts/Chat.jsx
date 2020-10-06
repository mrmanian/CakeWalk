import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';

export default function Chat({user}) {
  const [list, setList] = useState([]);
  const [text, setText  ] = useState("");

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleAdd() {
    const newList = list.concat({ text, id: uuidv4() });
    setList(newList);
    setText("");
    Socket.emit('newmessage', {'txt': text});
  
  }
  const handleKeypress = (event) => {
    if (event.keyCode === 13) {
      handleAdd();
    }
  };
  

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <input
          id="msg"
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeypress}
        />
        <button type="button" onClick={handleAdd}>
          Enter
        </button>
      </div>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{user} : {item.text}</li>
        ))}
      </ul>
    </div>
  );
}