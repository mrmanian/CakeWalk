import React, { useState } from 'react';
import './LandingPage.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

export default function LandingPage() {
  const [state, setState] = useState({ isPaneOpen: false });

  return (
    <div>
      <input type="image" className="about_btn" alt="About Page" src="https://i.imgur.com/mXTiG7V.png" onClick={() => setState({ isPaneOpenLeft: true })} />
      <SlidingPane
        isOpen={state.isPaneOpenLeft}
        title="Landing Page"
        width="94vw"
        from="left"
        onRequestClose={() => {
          setState({ isPaneOpenLeft: false });
        }}
      >

        <div id="body">
          <Header />
          <Card
            className="section"
            img="./Capture1.PNG"
            title="About the Team"
            description="The team here at CakeWalk includes Jacob Karpman, Aarati Srikumar,
                Devin Romanoff, and Michael Manian. This team are comprised of Computer Science
                Students at The New Jersey Institute of Technology. "
          />

          <Card
            className="section bg-grey"
            img="./Capture3.PNG"
            title="What is CakeWalk?"
            description="CakeWalk is the one-stop-shop for organizing projects. The app
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
                drives innovation and CakeWalk allows us to channel collaboration and
                build successful projects."
          />
          <ContactContainer />
        </div>
      </SlidingPane>
    </div>
  );
}

const Header = () => (
  <div className="header">
    <span className="header-title">
      <img className="logo" src="https://i.imgur.com/JBNbaE7.gif" alt="LOGO" />
    </span>
    <br />
    <span className="header-text">
      The place for all your Project Management needs...
    </span>
  </div>
);

const Card = (props) => (
  <div className={props.className}>
    <div className="small-div">
      <i className={props.className} />
      <img src={props.img} alt="" />
    </div>

    <div className="big-div">
      <span className="div-title">{props.title}</span>
      <br />
      <span>{props.description}</span>
    </div>
  </div>
);

const ContactContainer = () => (
  <div className="contact-container bg-grey">
    <span className="div-title">Contact us</span>
    <div className="contact-form">
      <div id="sect1">
        <span>Contact us and we will get back to you.</span>
        <span>
          <i className="fas fa-map-marker-alt" />
          CakeWalk
        </span>
        <span>
          <i className="far fa-envelope" />
          cs490.projectmanager@gmail.com
        </span>
      </div>
    </div>
  </div>
);
