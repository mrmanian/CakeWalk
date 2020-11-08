from os.path import join, dirname
import os
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy

import smtplib, ssl

app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

database_uri = os.environ["DATABASE_URL"]
email_password = os.environ["EMAIL_PASSWORD"]
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app
db.create_all()
db.session.commit()

CONNECTED = 0

import models

# Emit's list of users from users table
def emit_user_list():
    all_users = [
        (db_messages.username, db_messages.profile_img)
        for db_messages in db.session.query(models.Users).all()
    ]
    socketio.emit("get_user_list", {"user_list": all_users})

def create_and_send_email():
    port = 465  # For SSL
    # Create a secure SSL context
    """
    context = ssl.create_default_context()
    sender_email = "cs490.projectmanager@gmail.com"
    receiver_email = "cs490.projectmanager@gmail.com"
    message = "Test123"
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, email_password)
        server.sendmail(sender_email, receiver_email, message)
    """
    

@app.route("/")
def index():
    return flask.render_template("index.html")


@socketio.on("connect")
def on_connect():
    global CONNECTED
    print("Someone connected!")
    print("CONNECTED NUMBER: " + str(CONNECTED))
    return CONNECTED


@socketio.on("disconnect")
def on_disconnect():
    global CONNECTED
    CONNECTED -= 1
    print("Someone disconnected!")
    socketio.emit("disconnected", {"num": CONNECTED})


# Adds user data to user table on login
@socketio.on("newlogin")
def on_newlogin(data):
    print("Got an event for new user", data["uname"])
    uname = data["uname"]
    email = data["email"]
    img = data["imageurl"]
    gc = ""
    db.session.add(models.Users(uname, email, img, gc))
    db.session.commit()


# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    print("Received project information for code: ", data["groupCode"])
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["groupCode"]
    
    db.session.add(models.Projects(group_code, project_name, project_description))
    db.session.commit()

    print(project_name)
    print(project_description)
    print(group_code)
    
@socketio.on("create task")
def new_input(data):
    """Get values from task form"""
    print("Got an input with data:", data)
    
    create_and_send_email()

if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
