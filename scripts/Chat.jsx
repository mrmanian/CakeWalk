import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";


export default function Chat() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  function handleAdd() {
    const newList = list.concat({ name, id: uuidv4() });
    setList(newList);
    setName("");
  }
  const handleKeypress = (event) => {
    if (event.keyCode === 13) {
      console.log("check2");
      handleAdd();
    }
  };

  return (
    <div>
      <div>
        <input
          id="msg"
          type="text"
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeypress}
        />
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}