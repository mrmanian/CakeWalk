import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from './Socket';
import  Content from './Content';

export default function Chat({user}) {
  const [list, setList] = useState([]);
  const [text, setText  ] = useState("");
  const [chatUser, setChatUser] = useState({user});

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleBotIntervention(){
    Socket.on('newresponse', (data) => {
        if(data['answer']){
          console.log(data["answer"]);
          return(<li> Spock_bot: {data['answer']} </li>);
        }
      });
  }
  function handleAdd() {
      Socket.emit('newmessage', {'txt': text});
      
    
    //botResponse();
    const newList = list.concat({ text, id: uuidv4() });
    setList(newList);
    console.log(list);
    setText("");
    
  
  }
  const handleKeypress = (event) => {
    if (event.keyCode === 13) {
      handleAdd();
    }
  };
  function botResponse() {
    console.log("Got in botresponse");
    React.useEffect(() => {
      Socket.on('new message', (data) => {
        console.log("Recieved bot response "+ data['answer']);
        if(data['answer']){
          return;
        }
        else{
          setText(data['answer']);
          user("Spock_bot");
        }
      });
    });
  }
  

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
        {handleBotIntervention()}
      </ul>
    </div>
  );
}