from os.path import join, dirname
import os
import smtplib
import ssl
from dotenv import load_dotenv
import flask
import flask_socketio
import flask_sqlalchemy
from flask import request

app = flask.Flask(__name__)

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

database_uri = os.environ["DATABASE_URL"]
# email_password = os.environ["EMAIL_PASSWORD"]
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app
db.create_all()
db.session.commit()

CONNECTED = 0
CHANNEL = "get user list"
TASK_CHANNEL = "task list"

import models

# Emit's list of users from users table
def emit_user_list(channel):
    all_users = [
        db_username.username for db_username in db.session.query(models.Users).all()
    ]

    all_profile_pics = [
        db_profile_img.profile_img
        for db_profile_img in db.session.query(models.Users).all()
    ]
    
    print(all_users)
    socketio.emit(
        channel,
        {
            "all_users": all_users,
            "all_profile_pics": all_profile_pics,
        },
    )
    
    
def create_and_send_email(receiver_email):
    print("Sending email")
    result = db.session.query(models.Users).filter(
        models.Users.username == "CS490 ProjectManager"
    )
    user = result[0].username
    sender_email = "cs490.projectmanager@gmail.com"
    port = 465  # For SSL
    # Create a secure SSL context
    context = ssl.create_default_context()
    message = """
    Hello {},
    
    You have created a task on the Project Manager app!
    """.format(
        user
    )

    server = smtplib.SMTP_SSL("smtp.gmail.com", port, context=context)
    # server.login(sender_email, email_password)
    server.sendmail(sender_email, receiver_email, message)


# Emits list of
def emit_task_list(channel, user_gc = 'abc'):
    proj_names = [
        db_proj.proj_name for db_proj in db.session.query(models.Projects).filter(models.Projects.group_code == user_gc)    
    ]
    
    user_tasks = [
        db_task.title for db_task in db.session.query(models.Tasks).filter(models.Tasks.group_code == user_gc)    
    ]
    
    print('Extracting user projects and tasks')
    
    socketio.emit(channel, {
        'projects': proj_names,
        'tasks': user_tasks,
    })


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
    login_status = True
    uname = data["uname"]
    email = data["email"]
    img = data["imageurl"]
    gc = ""
    exists = db.session.query(db.exists().where(models.Users.email == email)).scalar()
    if(exists == False):
        db.session.add(models.Users(uname, email, img, gc))
        db.session.commit()
    sid = request.sid
    socketio.emit("connected", {"email": email}, sid)
    socketio.emit("login_status", {"loginStatus": login_status})
   
@socketio.on("emit")
def emit():
    emit_user_list(CHANNEL) 
    emit_task_list(TASK_CHANNEL)

# Gets information from create project page
@socketio.on("create project")
def on_create_project(data):
    print("Received new project data: ", data)
    project_name = data["projectName"]
    project_description = data["projectDescription"]
    group_code = data["groupCode"]
    project_users = data["selectedUsers"]
    db.session.add(models.Projects(group_code, project_name, project_description))
    db.session.commit()

# Gets information from create task page
@socketio.on("create task")
def on_create_task(data):
    print("Received new task data: ", data)
    email = data["email"]
    title = data["title"]
    description = data["description"]
    deadline = data["deadline"]
    owner = ""
    db.session.add(models.Tasks(title, description, deadline, "abc", owner))
    db.session.commit()
    create_and_send_email(email)
    
@socketio.on("task selection")
def on_select_task(data):
    print("User selected tasks")
    titles = data["titles"]
    owner = data["owner"]
    for task in titles:
        db.session.query(models.Tasks).filter(models.Tasks.title == task).update({models.Tasks.task_owner: owner})
    


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
