import React from "react";
import "./LandingPage.css";
import Dash from "./Dash";


export default function LandingPage({email}) {
  const [ret, updateRet] = React.useState(false);
  function handleReturn(e){
        e.preventDefault();
        updateRet(true);
    }
  if(ret){
        console.log("type is submit");
        return (<Dash email={email} />);
    }
    
  return (
    
    <div id="body">
      <Header email = {email}/>
      <button className="return" type="submit" onClick={handleReturn}>
        {" "}
        Return
      </button>
      <Card
        className="section"
        img="./Capture1.PNG"
        title="About the Team"
        description="The team here at Task Manager includes Jacob Karpman, Aarati Srikumar, 
                Devin Romanoff, and Michael Manian. This team are comprised of Computer Science
                Students at The New Jersey Institute of Technology. "
      />

      <Card
        className="section bg-grey"
        img="./Capture3.PNG"
        title="What is Task Manager?"
        description="Task manager is the one-stop-shop for organizing projects. The app
                works by allowing users to create projects with other logged users on the app. From 
                there the members of the project can create tasks and then members can select the task. To
                accomplish this we used React, HTML, CSS, PostgreSQL, and Heroku. "
      />

      <Card
        className="section"
        img="./Capture1.PNG"
        title="Importance"
        description="Communication amongst group members is one of the most important 
                aspects to teamwork. This application would streamline task assignment 
                and time management which is crucial to any project. Collaboration is what
                drives innovation and Task Manager allows us to channel collaboration and 
                build successful projects."
      />
      <ContactContainer />
    </div>
  );
}

const Header = ({email}) => {
  return (
    <div className="header">
      <span className="header-title">
        <img className="logo" src="https://i.ibb.co/dDSQhhP/taskmanagerlogo.png" alt="LOGO" />
        
      </span>
      <br />
      <span className="header-text">
        The place for all your Project Management needs...
      </span>
    </div>
  );
};

const Card = (props) => {
  return (
    <div className={props.className}>
      <div className="small-div">
        <i className={props.className}></i>
        <img src={props.img} alt="" />
      </div>

      <div className="big-div">
        <span className="div-title">{props.title}</span>
        <br />
        <span>{props.description}</span>
      </div>
    </div>
  );
};

const ContactContainer = () => {
  return (
    <div className="contact-container bg-grey">
      <span className="div-title">Contact us</span>
      <div className="contact-form">
        <div id="sect1">
          <span>Contact us and we will get back to you.</span>
          <span>
            <i className="fas fa-map-marker-alt"></i>
            Task Manager
          </span>
          <span>
            <i className="far fa-envelope"></i>
            cs490.projectmanager@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
};